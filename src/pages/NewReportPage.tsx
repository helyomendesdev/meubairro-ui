import { AppShell } from '../components/AppShell'

export function NewReportPage() {
  return (
    <AppShell pageTitle="Nova denúncia">
      <main className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Registro de ocorrência</p>
            <h1>Informe o problema encontrado</h1>
            <p className="lead">Forneça os dados essenciais para facilitar a identificação e o atendimento.</p>
          </div>
        </div>

        <form className="report-layout" onSubmit={(event) => event.preventDefault()}>
          <section className="form-card">
            <h2>Dados da denúncia</h2>
            <div className="form-grid">
              <label className="field field--full"><span>Título</span><input defaultValue="Lixo acumulado na rua" /></label>
              <label className="field"><span>Categoria</span><select defaultValue="Lixo e resíduos"><option>Lixo e resíduos</option><option>Iluminação</option><option>Vias</option><option>Saneamento</option></select></label>
              <label className="field"><span>Data da ocorrência</span><input defaultValue="14/08/2026" /></label>
              <label className="field field--full"><span>Descrição</span><textarea aria-label="Descrição" defaultValue="Há acúmulo de lixo próximo à esquina, dificultando a passagem e causando mau cheiro aos moradores." /><small>Descreva pontos de referência e detalhes que ajudem na localização.</small></label>
              <label className="field"><span>Bairro</span><input defaultValue="Parque Piauí" /></label>
              <label className="field"><span>Endereço aproximado</span><input defaultValue="Rua Principal, próximo à praça" /></label>
              <label className="field field--full"><span>Imagem da ocorrência</span><span className="upload-box">Arraste uma imagem ou clique para selecionar<strong>Anexar foto</strong><small>PNG ou JPG, até 5 MB</small></span><input className="sr-only" type="file" /></label>
            </div>
          </section>

          <aside className="location-card">
            <h2>Localização aproximada</h2>
            <div aria-label="Mapa aproximado" className="map-preview"><span className="map-pin" /></div>
            <label className="field"><span>Coordenadas</span><input defaultValue="-5.0892, -42.8019" /></label>
            <p>A localização exibida é aproximada e não será usada para divulgar dados pessoais do morador.</p>
            <button className="primary-button" type="submit">Registrar denúncia</button>
            <button className="secondary-button" type="button">Salvar rascunho</button>
          </aside>
        </form>
      </main>
    </AppShell>
  )
}
