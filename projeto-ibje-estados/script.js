
document.addEventListener('DOMContentLoaded', () => {

    const estadoSelect = document.getElementById('estado-select');
    const municipiosTbody = document.getElementById('municipios-tbody');

    const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';


    const carregarEstados = () => {
        fetch(urlEstados)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os estados.');
                }
                return response.json();
            })
            .then(estados => {
                // Ordena os estados por nome
                estados.sort((a, b) => a.nome.localeCompare(b.nome));


                estadoSelect.innerHTML = '<option value="" disabled selected>Selecione um Estado</option>';

                estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.sigla;
                    option.textContent = estado.nome;
                    estadoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Falha na requisição dos estados:", error);
                estadoSelect.innerHTML = '<option value="" disabled selected>Falha ao carregar estados</option>';
            });
    };

    
    const carregarMunicipios = (siglaEstado) => {
        if (!siglaEstado) return;

        const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`;


        municipiosTbody.innerHTML = '<tr><td colspan="4">Carregando municípios...</td></tr>';

        axios.get(urlMunicipios)
            .then(response => {
                const municipios = response.data;


                municipiosTbody.innerHTML = '';

                if (municipios.length === 0) {
                    municipiosTbody.innerHTML = '<tr><td colspan="4">Nenhum município encontrado para este estado.</td></tr>';
                    return;
                }

                municipios.forEach(municipio => {
                    const tr = document.createElement('tr');


                    const nomeCidade = municipio.nome;
                    const microrregiao = municipio.microrregiao.nome;
                    const mesorregiao = municipio.microrregiao.mesorregiao.nome;
                    const regiao = municipio.microrregiao.mesorregiao.UF.regiao.nome;

                    tr.innerHTML = `
                        <td>${nomeCidade}</td>
                        <td>${microrregiao}</td>
                        <td>${mesorregiao}</td>
                        <td>${regiao}</td>
                    `;
                    municipiosTbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error(`Falha na requisição dos municípios para ${siglaEstado}:`, error);
                municipiosTbody.innerHTML = '<tr><td colspan="4">Erro ao carregar os municípios. Tente novamente.</td></tr>';
            });
    };


    estadoSelect.addEventListener('change', (event) => {
        const siglaSelecionada = event.target.value;
        carregarMunicipios(siglaSelecionada);
    });


    carregarEstados();
});