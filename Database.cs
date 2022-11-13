using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SistemaLocacao
{
    class BancoDeDados : DbContext
    {
        public BancoDeDados(DbContextOptions<BancoDeDados> options) : base(options){}

        public DbSet<Imovel> Imoveis { get; set; } = null!;
        public DbSet<Locatario> Locatarios { get; set; } = null!;
        public DbSet<Locacao> Locacoes { get; set; } = null!;

    }
}