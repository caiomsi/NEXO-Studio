# NEXO STUDIO

Site do estúdio NEXO — agência brasileira de design e desenvolvimento web.

- **Stack:** HTML + CSS + JavaScript puro, sem build.
- **Deploy:** GitHub Pages (branch `master`, raiz) → https://caiomsi.github.io/NEXO-Studio/
- **Formulário:** wizard de brief em 3 passos que envia para o backend MSI-Forms
  (`site: 'nexo-studio'`) e gera uma mensagem pronta de WhatsApp.

## Antes de divulgar

- [ ] Trocar `WHATSAPP_NUMBER` em `js/main.js` pelo número real do estúdio.
- [ ] Ajustar os preços placeholder na seção **Investimento** (`index.html`).
- [ ] Quando houver domínio próprio: criar `CNAME`, apontar DNS e adicionar a
  origem em `MSI-Forms/api/submit.js`.

## Preview local

```bash
python3 -m http.server
# → http://localhost:8000
```
