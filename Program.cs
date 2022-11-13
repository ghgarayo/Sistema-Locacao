using System;
using System.IO;
using System.Collections.Generic;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SistemaLocacao
{

    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSqlite<BancoDeDados>(builder.Configuration.GetConnectionString("BancoDeDados") ?? "Data Source=BancoDeDados.db");
            builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
            var app = builder.Build();
            app.UseCors();

            // =============== CREATE =============== 

            // Locatario - ok 
            app.MapPost("/locatario/cadastrar", (BancoDeDados baseLocatarios, Locatario locatario) =>
            {
                if (baseLocatarios.Locatarios.Where(l => l.email == locatario.email).Count() > 0)
                {
                    return Results.Problem("Email já utilizado!");
                }
                baseLocatarios.Locatarios.Add(locatario);
                baseLocatarios.SaveChanges();
                return Results.Ok($"Locatário {locatario.nome} com sucesso!");
            });

            // Imovel - ok 
            app.MapPost("/imovel/cadastrar", (BancoDeDados baseImoveis, Imovel imovel) =>
            {
                baseImoveis.Imoveis.Add(imovel);
                baseImoveis.SaveChanges();
                return Results.Ok($"Imóvel de {imovel.proprietario} cadastrado!");
            });

            // Locacao - ok
            app.MapPost("/locacao/cadastrar/{id}", (BancoDeDados baseLocacoes, Locacao locacao, BancoDeDados baseLocatarios, BancoDeDados baseImoveis, int id) =>
            {
                Imovel buscaImovel = baseImoveis.Imoveis.Find(locacao.idImovel);

                if (baseImoveis.Imoveis.Find(locacao.idImovel) == null)
                {
                    return Results.NotFound("Nenhum imóvel encontrado!");
                }

                if (buscaImovel.disponivel.Equals("não"))
                {
                    return Results.Problem($"Imóvel {buscaImovel.id} indisponível.");
                }

                Locatario buscaLocatario = baseLocatarios.Locatarios.FirstOrDefault(locatario => locatario.email.Equals(locacao.emailLocatario));
                locacao.idLocatario = buscaLocatario.id;
                locacao.proprietarioImovel = buscaImovel.proprietario;
                buscaImovel.disponivel = "não";
                baseLocacoes.Locacoes.Add(locacao);
                baseImoveis.SaveChanges();
                baseLocacoes.SaveChanges();

                return Results.Ok($"Contrato de locação nº {locacao.id} gerado!");
            });

            // =============== READ =============== 

            // Locatario por email - ok
            app.MapGet("/locatario/{email}", (BancoDeDados baseLocatarios, string email) =>
            {
                return Results.Ok(baseLocatarios.Locatarios.FirstOrDefault(locatario => locatario.email.Equals(email)));
            });

            // Lista completa locatarios - ok
            app.MapGet("/locatario/lista", (BancoDeDados baseLocatarios) =>
            {
                return Results.Ok(baseLocatarios.Locatarios.ToList());
            });

            // Imovel por proprietario - ok
            app.MapGet("/imovel/{nomeProprietario}", (BancoDeDados baseImoveis, string nomeProprietario) =>
            {
                return Results.Ok(baseImoveis.Imoveis.Where(imovel => imovel.proprietario.Equals(nomeProprietario)).ToList());
            });

            // Lista completa de imoveis - ok
            app.MapGet("/imovel/lista", (BancoDeDados baseImoveis) =>
            {
                return Results.Ok(baseImoveis.Imoveis.ToList());
            });

            // Locacao por locatário - ok 
            app.MapGet("/locacao/locatario/{emailLocatario}", (BancoDeDados baseLocacoes, string emailLocatario) =>
            {
                return Results.Ok(baseLocacoes.Locacoes.Where(locacao => locacao.emailLocatario.Equals(emailLocatario)).ToList());
            });

            // Locacao por proprietário - ok
            app.MapGet("/locacao/proprietario/{nomeProprietario}", (BancoDeDados baseLocacoes, string nomeProprietario) =>
            {
                return Results.Ok(baseLocacoes.Locacoes.Where(locacao => locacao.proprietarioImovel.Equals(nomeProprietario)).ToList());
            });

            // Lista completa de locacao - ok
            app.MapGet("/locacao/lista", (BancoDeDados baseLocacoes) =>
            {
                return Results.Ok(baseLocacoes.Locacoes.ToList());
            });

            // =============== UPDATE =============== 

            // UPDATE nome ou email locatário
            app.MapPut("/locatario/atualizar/{id}", (BancoDeDados baseLocatarios, Locatario atualizacaoLocatario, int id) =>
            {
                string auxNome = "";
                string auxEmail = "";
                Locatario? encontraLocatario = baseLocatarios.Locatarios.Find(id);

                if (encontraLocatario == null)
                {
                    return Results.Problem("Locatário não encontrado.");
                }

                if (encontraLocatario.nome != null && encontraLocatario.email != null)
                {
                    auxNome = encontraLocatario.nome;
                    encontraLocatario.nome = atualizacaoLocatario.nome;
                    auxEmail = encontraLocatario.email;
                    encontraLocatario.email = atualizacaoLocatario.email;
                    baseLocatarios.SaveChanges();
                    return Results.Ok($"Nome alterado de {auxNome} para {encontraLocatario.nome}.\nEmail alterado de {auxEmail} para {encontraLocatario.email}.");
                }
                else if (encontraLocatario.nome != null)
                {
                    auxNome = encontraLocatario.nome;
                    encontraLocatario.nome = atualizacaoLocatario.nome;
                    baseLocatarios.SaveChanges();
                    return Results.Ok($"Nome alterado de {auxNome} para {encontraLocatario.nome}.");
                }
                else if (encontraLocatario.email != null)
                {
                    auxEmail = encontraLocatario.email;
                    encontraLocatario.email = atualizacaoLocatario.email;
                    baseLocatarios.SaveChanges();
                    return Results.Ok($"Email alterado de {auxEmail} para {encontraLocatario.email}.");
                }
                else
                {
                    return Results.NotFound("Nenhum locatário encontrado!");
                }
            });

            // UPDATE Imovel valor do aluguel e nome do Proprietario.
            app.MapPut("/imovel/atualizar/{id}", (BancoDeDados baseImoveis, Imovel atualizacaoImovel, int id) =>
            {
                string auxAluguel = "";
                string auxProprietario = "";
                Imovel? encontraImovel = baseImoveis.Imoveis.Find(id);
                

                if (atualizacaoImovel.valorAluguel != null && atualizacaoImovel.proprietario != null)
                {
                    auxAluguel = encontraImovel.valorAluguel;
                    encontraImovel.valorAluguel = atualizacaoImovel.valorAluguel;
                    auxProprietario = encontraImovel.proprietario;
                    encontraImovel.proprietario = atualizacaoImovel.proprietario;
                    baseImoveis.SaveChanges();
                    return Results.Ok($"Valor do aluguel alterado de R${auxAluguel} para R${encontraImovel.valorAluguel}.\nProprietário do imóvel alterado de {auxProprietario} para {encontraImovel.proprietario}.");
                }
                else if (atualizacaoImovel.valorAluguel != null)
                {
                    auxAluguel = encontraImovel.valorAluguel;
                    encontraImovel.valorAluguel = atualizacaoImovel.valorAluguel;
                    baseImoveis.SaveChanges();
                    return Results.Ok($"Valor do aluguel alterado de R${auxAluguel} para R${encontraImovel.valorAluguel}.");

                }
                else if (atualizacaoImovel.proprietario != null)
                {
                    auxProprietario = encontraImovel.proprietario;
                    encontraImovel.proprietario = atualizacaoImovel.proprietario;
                    baseImoveis.SaveChanges();
                    return Results.Ok($"Proprietário do imóvel alterado de {auxProprietario} para {encontraImovel.proprietario}.");
                }
                else
                {
                    return Results.NotFound("Nenhum imóvel encontrado!");
                }
            });

            // UPDATE locacao, tempo de contrato
            app.MapPut("/locacao/atualizar/{id}", (BancoDeDados baseLocacoes, Locacao atualizaLocacao, int id) =>
            {
                Locacao encontraLocacao = baseLocacoes.Locacoes.Find(id);
                encontraLocacao.tempoContrato = atualizaLocacao.tempoContrato;
                encontraLocacao.dataLocacao = atualizaLocacao.dataLocacao;
                baseLocacoes.SaveChanges();

                return Results.Ok($"Contrato de locação {encontraLocacao.id} extendido por {encontraLocacao.tempoContrato} à partir de {encontraLocacao.dataLocacao}.");
            });


            // =============== DELETE =============== 

            // DELETE Locatario

            app.MapDelete("/locatario/excluir/{id}", (BancoDeDados baseLocatarios, int id) =>
            {

                if (baseLocatarios.Locatarios.Find(id) == null)
                {
                    return Results.NotFound("Nenhum locatário encontrado!");
                }
                baseLocatarios.Locatarios.Remove(baseLocatarios.Locatarios.Find(id));
                baseLocatarios.SaveChanges();

                return Results.Ok($"Locatário removido!");
            });

            // ** DELETE Imovel **
            app.MapDelete("/imovel/excluir/{id}", (BancoDeDados baseImoveis, int id) =>
            {
                baseImoveis.Imoveis.Remove(baseImoveis.Imoveis.Find(id));
                baseImoveis.SaveChanges();
                return Results.Ok($"Imóvel de {baseImoveis.Imoveis.Find(id).proprietario} excluído do banco de dados.");
            });

            // ** DELETE Locacao **
            app.MapDelete("/locacao/excluir/{id}", (BancoDeDados baseLocacoes, BancoDeDados baseImoveis, int id) =>
            {
                baseLocacoes.Locacoes.Remove(baseLocacoes.Locacoes.Find(id));
                Imovel buscaImovel = baseImoveis.Imoveis.Find(baseLocacoes.Locacoes.Find(id).idImovel);
                buscaImovel.disponivel = "sim";
                baseLocacoes.SaveChanges();
                baseImoveis.SaveChanges();
                return Results.Ok($"Contrato de locação nº{id} removido!");
            });


            app.Run("http://localhost:3000");
        }
    }
}