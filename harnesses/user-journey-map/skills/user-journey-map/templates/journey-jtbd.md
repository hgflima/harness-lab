# Template: Jornada JTBD (5 colunas)

Variante **expandida** da skill `user-journey-map`. Use apenas quando intenção e sinal de sucesso precisam ser distintos por estágio.

## Estrutura da tabela

| Estágio | Job | Ação | Fricção | Sinal de sucesso |
|---------|-----|------|---------|------------------|
| *nome* | `[marca]` "quando ___, quero ___, para ___" | `[marca]` o que o cliente efetivamente faz | `[marca]` o que atrapalha | `[marca]` como o cliente sabe que deu certo |

### Sobre cada coluna

- **Job**: a intenção em linguagem natural JTBD. Formato: *"quando `<situação>`, quero `<resultado desejado>`, para `<motivação profunda>`"*. Se o formato completo for forçado, aceite uma frase curta equivalente.
- **Ação**: o que o cliente **faz** no estágio (comportamento observável). Linguagem do cliente, não técnica.
- **Fricção**: o que atrapalha, confunde, trava ou gera hesitação. Pode ser cognitiva, emocional, técnica ou contextual.
- **Sinal de sucesso**: como o próprio cliente percebe que aquele estágio terminou bem. **É diferente de métrica de produto** — é sinal do ponto de vista do cliente.

## Marcas de proveniência

Toda célula carrega uma marca inline:

- `[validado]` — confirmado pelo usuário
- `[sugerido]` — proposto por Claude, aguardando confirmação
- `[assumido]` — sem sinal, a validar

## Exemplo preenchido

| Estágio | Job | Ação | Fricção | Sinal de sucesso |
|---------|-----|------|---------|------------------|
| Descoberta | `[validado]` Quando preciso recarregar o celular, quero resolver sem sair da loja, para economizar tempo | `[validado]` Vê cartaz no caixa | `[sugerido]` Não há sinalização visível | `[sugerido]` Sente que é simples o suficiente pra tentar |
| Abertura do app | `[validado]` Quando decido usar, quero chegar rápido no fluxo, para não desistir | `[validado]` Escaneia QR no caixa | `[assumido]` QR code pode não funcionar no celular dele | `[validado]` App abre e mostra tela de recarga em 1 passo |
| Seleção | `[validado]` Quando vou recarregar, quero escolher operadora e valor sem errar | `[validado]` Seleciona operadora e valor | `[sugerido]` Não lembra operadora exata | `[sugerido]` Vê a operadora destacada como escolhida |

## Coluna opcional: Emoção

Em domínios emocionalmente carregados (saúde, luto, compras de alto envolvimento, decisões financeiras grandes), adicione uma 6ª coluna:

| ... | Emoção |
|-----|--------|
| ... | `[marca]` estado emocional predominante nesse estágio |

**Não adicione Emoção por padrão.** Só quando o domínio demanda e o usuário valida que a dimensão emocional é relevante para o produto.

## Regra de contenção

Se, ao preencher, você percebe que **Job e Ação estão dizendo quase a mesma coisa**, isso é sinal de que a jornada não precisava de 5 colunas — devia ter ficado em Pareto. Considere avisar o usuário e recuar pra 3 colunas. Simplicity First.
