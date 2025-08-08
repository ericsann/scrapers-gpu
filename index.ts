import { promises as fs } from 'fs';
import { KabumScraper } from './src/scrapers/kabumScraper.js';
import type { ResultadoScraping } from './src/types/PlacaVideo.js';

async function salvarResultados(placas: any[], nomeArquivo: string = 'resultado_placas.json'): Promise<void> {
  const resultado: ResultadoScraping = {
    timestamp: new Date().toISOString(),
    total_placas: placas.length,
    placas: placas
  };

  try {
    await fs.writeFile(
      nomeArquivo,
      JSON.stringify(resultado, null, 2),
      'utf8'
    );
    console.log(`✅ Resultados salvos em ${nomeArquivo} (${placas.length} placas)`);
  } catch (error) {
    console.error('❌ Erro ao salvar arquivo:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  const scraper = new KabumScraper();

  try {
    console.log('🎯 Iniciando scraper de placas de vídeo NVIDIA da Kabum...\n');

    // Inicializar o scraper
    await scraper.inicializar();

    // Executar o scraping (máximo 3 páginas para teste)
    const placas = await scraper.scrapePlacasNvidia(3);

    if (placas.length === 0) {
      console.log('⚠️ Nenhuma placa foi encontrada.');
      return;
    }

    // Salvar resultados
    await salvarResultados(placas);

    // Exibir resumo
    console.log('\n📊 RESUMO DO SCRAPING:');
    console.log(`Total de placas encontradas: ${placas.length}`);
    console.log('\nPrimeiras 3 placas encontradas:');
    placas.slice(0, 3).forEach((placa, index) => {
      console.log(`${index + 1}. ${placa.modelo} - ${placa.preco} - ${placa.ram} ${placa.gddr}`);
    });

    console.log('\n🎉 Scraping concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o scraping:', error);
    process.exit(1);
  } finally {
    // Sempre fechar o browser
    await scraper.fechar();
  }
}

// Executar o programa principal
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
