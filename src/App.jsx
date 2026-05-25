import { useState, useRef } from 'react';
import logo from './assets/logo.png';

export default function TravelReportSystem() {

  const reportRef = useRef(null);
  const [savedMessage, setSavedMessage] = useState('');

  const [activities, setActivities] = useState([
    {
      horario: '',
      turno: 'Manhã',
      tipo: 'Aula',
      local: '',
      responsavel: '',
      descricao: '',
      pedagogico: '',
      observacoes: '',
    },
  ]);

  const [formData, setFormData] = useState({
    programa: 'Do Piauí para o Mundo',
    cidade: '',
    estado: '',
    data: '',
    hotel: '',
    responsavelGeral: '',
    quantidade: '',
    saude: '',
    alimentacao: '',
    comportamento: '',
    engajamento: '',
    consideracoes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        horario: '',
        turno: 'Manhã',
        tipo: 'Aula',
        local: '',
        responsavel: '',
        descricao: '',
        pedagogico: '',
        observacoes: '',
      },
    ]);
  };

  const removeActivity = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
  };

  const groupedActivities = {
    Manhã: activities.filter((a) => a.turno === 'Manhã'),
    Tarde: activities.filter((a) => a.turno === 'Tarde'),
    Noite: activities.filter((a) => a.turno === 'Noite'),
  };

  const generateReport = () => {
    return `
${formData.programa} – ${formData.cidade}

Relatório de Atividades – ${formData.data}

1. Aulas, Atividades e Aspectos Pedagógicos

MANHÃ

${groupedActivities['Manhã']
  .map(
    (a) => `• ${a.horario} – ${a.tipo} em ${a.local}.
Responsável: ${a.responsavel}
${a.descricao}
Aspectos pedagógicos: ${a.pedagogico}
${a.observacoes ? 'Observações: ' + a.observacoes : ''}`
  )
  .join('\n\n')}

TARDE

${groupedActivities['Tarde']
  .map(
    (a) => `• ${a.horario} – ${a.tipo} em ${a.local}.
Responsável: ${a.responsavel}
${a.descricao}
Aspectos pedagógicos: ${a.pedagogico}
${a.observacoes ? 'Observações: ' + a.observacoes : ''}`
  )
  .join('\n\n')}

NOITE

${groupedActivities['Noite']
  .map(
    (a) => `• ${a.horario} – ${a.tipo} em ${a.local}.
Responsável: ${a.responsavel}
${a.descricao}
Aspectos pedagógicos: ${a.pedagogico}
${a.observacoes ? 'Observações: ' + a.observacoes : ''}`
  )
  .join('\n\n')}

2. Saúde e Alimentação

Saúde:
${formData.saude}

Alimentação:
${formData.alimentacao}

3. Comportamento e Engajamento

Comportamento:
${formData.comportamento}

Engajamento:
${formData.engajamento}

4. Considerações Finais

${formData.consideracoes}

Responsável pelo relatório:
${formData.responsavelGeral}
`;
  };

  // ── GERAR PDF via impressão ───────────────────────────────────
  const handleGeneratePDF = () => {
    const conteudo = generateReport();
    const janela = window.open('', '_blank');
    janela.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório – ${formData.cidade || 'Viagem'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            line-height: 1.8;
            margin: 40px;
            color: #111;
            white-space: pre-wrap;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>${conteudo}</body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    setTimeout(() => {
      janela.print();
    }, 300);
  };

  // ── SALVAR ────────────────────────────────────────────────────
  const handleSave = () => {
    const data = { formData, activities, savedAt: new Date().toISOString() };
    localStorage.setItem('relatorio_salvo', JSON.stringify(data));
    setSavedMessage('Relatório salvo com sucesso!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // ── CARREGAR ──────────────────────────────────────────────────
  const handleLoad = () => {
    const saved = localStorage.getItem('relatorio_salvo');
    if (saved) {
      const { formData: fd, activities: act } = JSON.parse(saved);
      setFormData(fd);
      setActivities(act);
      setSavedMessage('Relatório carregado!');
      setTimeout(() => setSavedMessage(''), 3000);
    } else {
      setSavedMessage('Nenhum relatório salvo encontrado.');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-[32px] shadow-2xl p-10 space-y-8">

        {/* HEADER */}
        <div className="bg-gray-950 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="bg-black p-4 rounded-3xl shadow-lg">
              <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Sistema de Relatórios de Viagens</h1>
              <p className="text-gray-300 mt-2 text-lg">Programa Do Piauí para o Mundo</p>
            </div>
          </div>
        </div>

        {/* DADOS GERAIS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Programa" name="programa" value={formData.programa} onChange={handleChange} />
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Estado" name="estado" value={formData.estado} onChange={handleChange} />
          <input type="date" className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" name="data" value={formData.data} onChange={handleChange} />
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hotel" name="hotel" value={formData.hotel} onChange={handleChange} />
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Quantidade de estudantes" name="quantidade" value={formData.quantidade} onChange={handleChange} />
          <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" placeholder="Responsável Geral" name="responsavelGeral" value={formData.responsavelGeral} onChange={handleChange} />
        </section>

        {/* ATIVIDADES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Atividades do Dia</h2>
            <button onClick={addActivity} className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition">+ Adicionar atividade</button>
          </div>

          {activities.map((activity, index) => (
            <div key={index} className="border border-gray-200 rounded-3xl p-6 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-700">Atividade {index + 1}</h3>
                {activities.length > 1 && (
                  <button onClick={() => removeActivity(index)} className="text-red-600 font-medium">Remover</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="time" className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value={activity.horario} onChange={(e) => handleActivityChange(index, 'horario', e.target.value)} />
                <select className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value={activity.turno} onChange={(e) => handleActivityChange(index, 'turno', e.target.value)}>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                </select>
                <select className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value={activity.tipo} onChange={(e) => handleActivityChange(index, 'tipo', e.target.value)}>
                  <option>Aula</option>
                  <option>Visita Técnica</option>
                  <option>Passeio Cultural</option>
                  <option>Alimentação</option>
                  <option>Deslocamento</option>
                  <option>Reunião</option>
                  <option>Outro</option>
                </select>
              </div>
              <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Local" value={activity.local} onChange={(e) => handleActivityChange(index, 'local', e.target.value)} />
              <input className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Responsável" value={activity.responsavel} onChange={(e) => handleActivityChange(index, 'responsavel', e.target.value)} />
              <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Descrição da atividade" value={activity.descricao} onChange={(e) => handleActivityChange(index, 'descricao', e.target.value)} />
              <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Aspectos pedagógicos" value={activity.pedagogico} onChange={(e) => handleActivityChange(index, 'pedagogico', e.target.value)} />
              <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[100px]" placeholder="Observações adicionais" value={activity.observacoes} onChange={(e) => handleActivityChange(index, 'observacoes', e.target.value)} />
            </div>
          ))}
        </section>

        {/* SAÚDE E ALIMENTAÇÃO */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Saúde e Alimentação</h2>
          <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Saúde" name="saude" value={formData.saude} onChange={handleChange} />
          <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Alimentação" name="alimentacao" value={formData.alimentacao} onChange={handleChange} />
        </section>

        {/* COMPORTAMENTO E ENGAJAMENTO */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Comportamento e Engajamento</h2>
          <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Comportamento" name="comportamento" value={formData.comportamento} onChange={handleChange} />
          <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]" placeholder="Engajamento" name="engajamento" value={formData.engajamento} onChange={handleChange} />
        </section>

        {/* CONSIDERAÇÕES FINAIS */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Considerações Finais</h2>
          <textarea className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[150px]" placeholder="Considerações finais" name="consideracoes" value={formData.consideracoes} onChange={handleChange} />
        </section>



        {/* FEEDBACK */}
        {savedMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-6 py-4 text-center font-medium">
            {savedMessage}
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-4">
          <button onClick={handleGeneratePDF} className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition">
            Gerar PDF
          </button>

        </div>

      </div>
    </div>
  );
}
