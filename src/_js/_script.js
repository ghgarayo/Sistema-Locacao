const url = "http://localhost:3000/";

function cadastrarLocatario() {
  //validacao de alguns dos inputs
  if (!validaNome("nome-completo")) {
    return;
  }

  //construcao do json que vai no body da criacao de usuario
  let body = {
    email: document.getElementById("email").value,
    nome: document.getElementById("nome-completo").value,
  };

  //envio da requisicao usando a FETCH API

  //configuracao e realizacao do POST no endpoint "locatario/cadastrar"
  fetch(url + "locatario/cadastrar", {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    //checa se requisicao deu certo
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    //trata resposta
    .then((output) => {
      alert("Locatário Cadastrado com sucesso!");
    })
    //trata erro
    .catch((error) => {
      alert("Não foi possível efetuar o cadastro!");
    });
}

function cadastrarImovel() {
  let body = {
    endereco: document.getElementById("endereco").value,
    numero: document.getElementById("numero").value,
    complemento: document.getElementById("complemento").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    proprietario: document.getElementById("nome-completo-proprietario").value,
    valorAluguel: document.getElementById("valor-aluguel").value,
    disponivel: "sim",
  };

  fetch(url + "imovel/cadastrar", {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })

    .then((output) => {
      alert("Imóvel Cadastrado com sucesso!");
    })
    .catch((error) => {
      alert("Não foi possível efetuar o cadastro do imóvel!");
    });
}

function cadastrarLocacao(idImovel) {
  let body = {
    idImovel: idImovel,
    emailLocatario: document.getElementById("email-locatario").value,
    dataLocacao: document.getElementById("data-locacao").value,
    tempoContrato: document.getElementById("tempo-contrato").value,
  };

  console.log(body);

  fetch(url + "locacao/cadastrar/" + idImovel, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })

    .then((output) => {
      alert("Locação cadastrada com sucesso!");
    })
    .catch((error) => {
      alert("Não foi possível finalizar locação!");
    });
}

function listarLocatarios() {
  //da um GET no endpoint "Locatarios"
  fetch(url + "locatario/lista")
    .then((response) => response.json())
    .then((locatarios) => {
      //pega div que vai conter a lista de locatarios
      let listaLocatarios = document.getElementById("lista-locatarios");

      //limpa div
      while (listaLocatarios.firstChild) {
        listaLocatarios.removeChild(listaLocatarios.firstChild);
      }

      //preenche div com locatarios recebidos do GET
      for (let locatario of locatarios) {
        //cria div para as informacoes de um locatario
        let divLocatario = document.createElement("div");
        divLocatario.setAttribute("class", "listas");

        //pega o nome do locatario
        let divNome = document.createElement("input");
        divNome.placeholder = "Nome Completo";
        divNome.value = locatario.nome;
        divLocatario.appendChild(divNome);

        //pega o email do locatario
        let divEmail = document.createElement("input");
        divEmail.placeholder = "E-mail";
        divEmail.value = locatario.email;
        divLocatario.appendChild(divEmail);

        //cria o botao para remover o locatario
        let btnRemover = document.createElement("button");
        btnRemover.innerHTML = "Remover";
        btnRemover.onclick = (u) => removerLocatario(locatario.id);

        //cria o botao para atualizar o locatario
        let btnAtualizar = document.createElement("button");
        btnAtualizar.innerHTML = "Atualizar";
        btnAtualizar.onclick = (u) =>
          atualizarLocatario(locatario.id, divNome, divEmail);

        //cria a div com os dois botoes
        let divBotoes = document.createElement("div");
        divBotoes.style.display = "flex";
        divBotoes.appendChild(btnRemover);
        divBotoes.appendChild(btnAtualizar);
        divLocatario.appendChild(divBotoes);
        
        //insere a div do locatario na div com a lista de locatarios
        
        listaLocatarios.appendChild(divLocatario);
      }
    });
  }

  function listarImoveis() {
    //da um GET no endpoint "Imoveis"
    fetch(url + "imovel/lista")
      .then((response) => response.json())
      .then((imoveis) => {
        //pega div que vai conter a lista de locatarios
        let listaImoveis = document.getElementById("lista-imoveis");
  
        //limpa div
        while (listaImoveis.firstChild) {
          listaImoveis.removeChild(listaImoveis.firstChild);
        }

        //preenche div com locatarios recebidos do GET
        for (let imovel of imoveis) {
          //cria div para as informacoes de uma div
          let divImovel = document.createElement("div");
          divImovel.setAttribute("class", "listas");
  
          //pega o ID do imovel
          let divIdImovel = document.createElement("input");
          divIdImovel.value = imovel.id;
  
          //console.log(`Id do imóvel é: ${divIdImovel.value}`);
  
          //pega o endereço
          let divEndereco = document.createElement("input");
          divEndereco.placeholder = "Endereço";
          divEndereco.value = imovel.endereco;
          divEndereco.setAttribute("class", "nao-editavel");
          divEndereco.setAttribute("disabled", "disabled");
          divImovel.appendChild(divEndereco);
  
          //pega o numero do endereço do imovel
          let divNumero = document.createElement("input");
          divNumero.placeholder = "Número";
          divNumero.value = imovel.numero;
          divNumero.setAttribute("class", "nao-editavel");
          divNumero.setAttribute("disabled", "disabled");
          divImovel.appendChild(divNumero);
  
          //pega o complemento do endereço do imovel
          let divComplemento = document.createElement("input");
          divComplemento.placeholder = "Complemento";
          divComplemento.value = imovel.complemento;
          divComplemento.setAttribute("class", "nao-editavel");
          divComplemento.setAttribute("disabled", "disabled");
          divImovel.appendChild(divComplemento);
  
          //pega o Bairro do endereço do imovel
          let divBairro = document.createElement("input");
          divBairro.placeholder = "Bairro";
          divBairro.value = imovel.bairro;
          divBairro.setAttribute("class", "nao-editavel");
          divBairro.setAttribute("disabled", "disabled");
          divImovel.appendChild(divBairro);
  
          //pega a cidade do imovel
          let divCidade = document.createElement("input");
          divCidade.placeholder = "Cidade";
          divCidade.value = imovel.cidade;
          divCidade.setAttribute("class", "nao-editavel");
          divCidade.setAttribute("disabled", "disabled");
          divImovel.appendChild(divCidade);
  
          //pega o estado do imovel
          let divEstado = document.createElement("input");
          divEstado.placeholder = "Estado";
          divEstado.value = imovel.estado;
          divEstado.setAttribute("class", "nao-editavel");
          divEstado.setAttribute("disabled", "disabled");
          divImovel.appendChild(divEstado);
  
          //pega o proprietario do imovel
          let divProprietario = document.createElement("input");
          divProprietario.placeholder = "Nome Completo Proprietário";
          divProprietario.value = imovel.proprietario;
          divImovel.appendChild(divProprietario);
  
          //pega o valor do aluguel do imovel
          let divAluguel = document.createElement("input");
          divAluguel.placeholder = "Valor Aluguel";
          divAluguel.value = imovel.valorAluguel;
          divImovel.appendChild(divAluguel);
  
          //cria o botao para remover o imovel
          let btnRemover = document.createElement("button");
          btnRemover.innerHTML = "Remover";
          btnRemover.onclick = (u) => removerImovel(imovel.id);
  
          //cria o botao para atualizar o imovel
          let btnAtualizar = document.createElement("button");
          btnAtualizar.innerHTML = "Atualizar";
          btnAtualizar.onclick = (u) =>
            atualizarImovel(imovel.id, divProprietario, divAluguel);
  
          //cria o botao de criar locacao
          let btnAlugar = document.createElement("button");
          btnAlugar.innerHTML = "Alugar";
  
          btnAlugar.onclick = () => {
            let alugaImovel = document.getElementById("aluga-imovel");
  
            while (alugaImovel.firstChild) {
              alugaImovel.removeChild(alugaImovel.firstChild);
            }
  
            let divCriaLocacao = document.createElement("div");
            divCriaLocacao.setAttribute("class", "cadastrar-locacao");
  
            let divFormLocacao = document.createElement("div");
            divFormLocacao.setAttribute("class", "form");
  
            let divIdImovel = document.createElement("input");
            divIdImovel.setAttribute("id", "id-imovel;");
            divIdImovel.setAttribute("disabled", "disabled;");
            divIdImovel.placeholder = imovel.id;
            divFormLocacao.appendChild(divIdImovel);
  
            let divEmailLocatario = document.createElement("input");
            divEmailLocatario.setAttribute("type", "text");
            divEmailLocatario.setAttribute("id", "email-locatario");
            divEmailLocatario.placeholder = "E-mail do Locatário";
            divFormLocacao.appendChild(divEmailLocatario);
  
            let divDataLocacao = document.createElement("input");
            divDataLocacao.setAttribute("id", "data-locacao");
            divDataLocacao.placeholder = "Data de Locação";
            divFormLocacao.appendChild(divDataLocacao);
  
            let divTempoContrato = document.createElement("input");
            divTempoContrato.setAttribute("id", "tempo-contrato");
            divTempoContrato.placeholder = "Duração da Locação";
            divFormLocacao.appendChild(divTempoContrato);
  
            let btnAlugarImovel = document.createElement("button");
            btnAlugarImovel.innerHTML = "Alugar Imóvel";
            btnAlugarImovel.onclick = () => cadastrarLocacao(imovel.id);
  
            divFormLocacao.appendChild(btnAlugarImovel);
            divCriaLocacao.appendChild(divFormLocacao);
            alugaImovel.appendChild(divCriaLocacao);
          };
  
          //cria a div com os dois botoes
          let divBotoes = document.createElement("div");
          divBotoes.style.display = "flex";
          divBotoes.appendChild(btnAlugar);
          divBotoes.appendChild(btnAtualizar);
          divBotoes.appendChild(btnRemover);
          divImovel.appendChild(divBotoes);
  
          //insere a div do imovel na div com a lista de imovels
          
          listaImoveis.appendChild(divImovel);
        }
      });
  }
  
  function listarLocacoes() {
  //da um GET no endpoint "Locacoes"
  fetch(url + "locacao/lista")
    .then((response) => response.json())
    .then((locacoes) => {
      //pega div que vai conter a lista de locatarios
      let listaLocacoes = document.getElementById("lista-locacoes");

      //limpa div
      while (listaLocacoes.firstChild) {
        listaLocacoes.removeChild(listaLocacoes.firstChild);
      }

      //preenche div com locacoes recebidos do GET
      for (let locacao of locacoes) {
        //cria div para as informacoes de um Locacao
        let divLocacao = document.createElement("div");
        divLocacao.setAttribute("class", "listas");

        //pega o ID do Locacao
        let divIdLocacao = document.createElement("input");
        divIdLocacao.placeholder = "Contrato de Locação";
        divIdLocacao.value = locacao.id;
        divIdLocacao.setAttribute("class", "nao-editavel");
        divIdLocacao.setAttribute("disabled", "disabled");
        
        divLocacao.appendChild(divIdLocacao);

        let divNomeLocatario = document.createElement("input");
        divNomeLocatario.placeholder = "Nome do Locatário";
        divNomeLocatario.value = retornaNomeLocatario(locacao);
        console.log("Div Nome Locatario: " + divNomeLocatario.value);
        divNomeLocatario.setAttribute("class", "nao-editavel");
        divNomeLocatario.setAttribute("disabled", "disabled");
        divLocacao.appendChild(divNomeLocatario);

        //pega o email do locatario
        let divEmailLocacao = document.createElement("input");
        divEmailLocacao.placeholder = "E-mail";
        divEmailLocacao.value = locacao.emailLocatario;
        divEmailLocacao.setAttribute("class", "nao-editavel");
        divEmailLocacao.setAttribute("disabled", "disabled");
        divLocacao.appendChild(divEmailLocacao);

        //pega o Proprietario do imovel
        let divProprietarioLocacao = document.createElement("input");
        divProprietarioLocacao.placeholder = "Proprietário do Imóvel";
        divProprietarioLocacao.value = locacao.proprietarioImovel;
        divProprietarioLocacao.setAttribute("class", "nao-editavel");
        divProprietarioLocacao.setAttribute("disabled", "disabled");
        divLocacao.appendChild(divProprietarioLocacao);

        //pega a data de locação do imovel
        let divDataLocacao = document.createElement("input");
        divDataLocacao.placeholder = "Data de Locação";
        divDataLocacao.value = locacao.dataLocacao;
        divLocacao.appendChild(divDataLocacao);

        //pega a duraçao da locação do imovel
        let divDuracaoLocacao = document.createElement("input");
        divDuracaoLocacao.placeholder = "Tempo de Contrato";
        divDuracaoLocacao.value = locacao.tempoContrato;
        divLocacao.appendChild(divDuracaoLocacao);

        //cria o botao para remover o Locacao
        let btnRemover = document.createElement("button");
        btnRemover.innerHTML = "Remover";
        btnRemover.onclick = (u) => removerLocacao(locacao.id);

        //cria o botao para atualizar o Locacao
        let btnAtualizar = document.createElement("button");
        btnAtualizar.innerHTML = "Renovar";
        btnAtualizar.onclick = (u) =>
          atualizarLocacao(locacao.id, divDuracaoLocacao, divDataLocacao);

        //cria a div com os dois botoes
        let divBotoes = document.createElement("div");
        divBotoes.style.display = "flex";
        divBotoes.appendChild(btnRemover);
        divBotoes.appendChild(btnAtualizar);
        divLocacao.appendChild(divBotoes);

        //insere a div do Locacao na div com a lista de Locacaos
        listaLocacoes.appendChild(divLocacao);
      }
    });
}

function atualizarLocatario(id, divNome, divEmail) {
  let body = {
    nome: divNome.value,
    email: divEmail.value,
  };

  fetch(url + "locatario/atualizar/" + id, {
    method: "PUT",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert("Locatário Atualizado com sucesso!");
    })
    .catch((error) => {
      console.log(error);
      alert("Não foi possível atualizar o locatário");
    });
}

function atualizarImovel(id, divProprietario, divAluguel) {
  let body = {
    proprietario: divProprietario.value,
    valorAluguel: divAluguel.value,
  };

  fetch(url + "imovel/atualizar/" + id, {
    method: "PUT",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert("Imóvel atualizado com sucesso!");
    })
    .catch((error) => {
      alert("Não foi possível atualizar os dados do imóvel!");
    });
}


function atualizarLocacao(id, divDuracaoLocacao, divDataLocacao) {
  
  console.log(divDuracaoLocacao.value)
  console.log(divDataLocacao.value)
  
  let body = {
    tempoContrato: divDuracaoLocacao.value,
    dataLocacao: divDataLocacao.value
  };

  console.log(body);

  fetch(url + "locacao/atualizar/" + id, {
    method: "PUT",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert(`Contrato de Locação nº${id} atualizado`);
    })
    .catch((error) => {
      alert(`Não foi possível renovar o contrato de locação nº${id}.`);
    });
}

function removerLocatario(id) {
  fetch(url + "locatario/excluir/" + id, {
    method: "DELETE",
    redirect: "follow",
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert("Locatário removido!");
    })
    .catch((error) => {
      alert("Não foi possível remover o locatário");
    });
}

function removerImovel(id) {
  fetch(url + "imovel/excluir/" + id, {
    method: "DELETE",
    redirect: "follow",
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert("Imóvel removido!");
    })
    .catch((error) => {
      console.log(error);
      alert("Não foi possível remover o imóvel.");
    });
}

function removerLocacao(id) {
  fetch(url + "locacao/excluir/" + id, {
    method: "DELETE",
    redirect: "follow",
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((output) => {
      alert(`Contrato de Locação nº${id} excluído`);
    })
    .catch((error) => {
      console.log(error);
      alert(`Não foi possível excluir o contrato de locação nº${id}.`);
    });
}

function retornaNomeLocatario(locacao) {
  
  console.log(locacao.emailLocatario);
  fetch(url + "locatario/lista")
    .then((response) => response.json())
    .then((locatarios) => {
      for (let locatario of locatarios) {
        if(locacao.emailLocatario == locatario.email)
        {
          console.log(locatario.nome);
          return locatario.nome;
        }
      }
    }); 
}
