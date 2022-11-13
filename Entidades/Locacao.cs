
namespace SistemaLocacao
{
    class Locacao
    {
        public int id { get; set; }
        public int idImovel { get; set; }
        public int idLocatario { get; set; }
        public string? dataLocacao { get; set; }
        public string? tempoContrato { get; set; }
        public string? proprietarioImovel { get; set; }
        public string? emailLocatario { get; set; }
    }

}