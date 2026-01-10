---
description: Como fazer o deploy da aplicação na Vercel
---
Este workflow descreve os passos para publicar a aplicação usando a Vercel, que é a plataforma recomendada para este projeto Vite + Node.js (Serverless).

1. **Verificar Build**: Certifique-se de que o projeto compila sem erros.
   ```ps1
   npm run build
   ```

2. **Login na Vercel**: Se ainda não estiver logado, autentique-se.
   ```ps1
   npx vercel login
   ```

3. **Deploy para Produção**: Execute o comando de deploy.
   - Na primeira vez, ele fará algumas perguntas de configuração.
   - Responda 'y' para confirmar.
   - Escolha o projeto atual.
   - Mantenha as configurações padrão (geralmente detecta Vite automaticamente).
   ```ps1
   npx vercel --prod
   ```

**Configurações Importantes do Vercel:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
