# leonardo

Tema Hugo minimalista com notas marginais (sidenotes).

## Uso

Copie a pasta `tema-leonardo` para `themes/` do seu projeto e adicione ao `hugo.toml`:

```toml
theme = 'leonardo'
```

## Notas marginais

Use a sintaxe padrão de footnotes do Markdown:

```markdown
Texto com nota.[^1]

[^1]: Texto da nota marginal.
```

Em desktop aparecem na margem direita. Em mobile, toque no número para expandir.

## Customização

Para sobrescrever o CSS sem alterar o tema, crie `static/css/main.css` na raiz do seu projeto.
