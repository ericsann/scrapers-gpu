import puppeteer, { Browser, Page, HTTPRequest } from 'puppeteer';
import type { PlacaVideo } from '../types/PlacaVideo.js';
import { processarDadosPlacas } from '../services/openaiService.js';
import { kabumHeaders, kabumCookies } from '../utils/headers.js';

export class KabumScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async inicializar(): Promise<void> {
    console.log('🚀 Iniciando browser...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();

    // Configurar viewport
    await this.page.setViewport({ width: 1920, height: 1080 });

    // Configurar user agent e headers
    await this.page.setUserAgent(kabumHeaders['user-agent']);
    await this.page.setExtraHTTPHeaders(kabumHeaders);

    // Configurar cookies
    const cookies = this.parseCookies(kabumCookies);
    await this.page.setCookie(...cookies);

    // Configurar interceptação de requests
    await this.page.setRequestInterception(true);
    
    this.page.on('request', (interceptedRequest: HTTPRequest) => {
      if (interceptedRequest.isInterceptResolutionHandled()) return;
      
      // Bloquear recursos desnecessários para acelerar o carregamento
      const resourceType = interceptedRequest.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    console.log('✅ Browser configurado com sucesso');
  }

  private parseCookies(cookieString: string) {
    return cookieString.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return {
        name: name?.trim() || '',
        value: value || '',
        domain: '.kabum.com.br'
      };
    });
  }

  async scrapePlacasNvidia(maxPaginas: number = 5): Promise<PlacaVideo[]> {
    if (!this.page) {
      throw new Error('Browser não foi inicializado. Chame inicializar() primeiro.');
    }

    const todasPlacas: PlacaVideo[] = [];
    
    for (let pagina = 1; pagina <= maxPaginas; pagina++) {
      console.log(`📄 Processando página ${pagina}/${maxPaginas}...`);
      
      try {
        const url = `https://www.kabum.com.br/hardware/placa-de-video-vga/placa-de-video-nvidia?page_number=${pagina}&page_size=20&facet_filters=&sort=most_searched`;
        
        console.log(`🌐 Navegando para: ${url}`);
        await this.page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });

        // Aguardar o carregamento do script __NEXT_DATA__
        await this.page.waitForSelector('script#__NEXT_DATA__', { timeout: 15000 });

        // Extrair dados do script __NEXT_DATA__
        const dadosRaw = await this.page.evaluate(() => {
          const script = document.querySelector('script#__NEXT_DATA__');
          return script ? script.textContent : null;
        });

        if (!dadosRaw) {
          console.log(`⚠️ Nenhum dado encontrado na página ${pagina}`);
          continue;
        }

        console.log(`📊 Processando dados da página ${pagina} com OpenAI...`);
        
        // Processar dados com OpenAI
        const placasPagina = await processarDadosPlacas(dadosRaw);
        
        if (placasPagina.length === 0) {
          console.log(`⚠️ Nenhuma placa encontrada na página ${pagina}`);
          break; // Se não encontrou placas, provavelmente chegou ao fim
        }

        todasPlacas.push(...placasPagina);
        console.log(`✅ Encontradas ${placasPagina.length} placas na página ${pagina}`);

        // Aguardar um pouco entre as páginas para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Erro ao processar página ${pagina}:`, error);
        continue;
      }
    }

    console.log(`🎉 Scraping concluído! Total de placas encontradas: ${todasPlacas.length}`);
    return todasPlacas;
  }

  async fechar(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser fechado');
    }
  }
}
