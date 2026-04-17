# Template: Jornada Pareto (3 colunas)

Variante **default** da skill `user-journey-map`. Use sempre que não houver razão forte para escalar.

## Estrutura da tabela

| Estágio | O que o cliente quer | O que trava |
|---------|---------------------|-------------|
| *nome do estágio* | `[marca]` jobs/intenção do cliente | `[marca]` fricções, dúvidas, decisões difíceis |

## Marcas de proveniência

Toda célula (inclusive o nome do estágio, se relevante) deve trazer uma marca inline:

- `[validado]` — usuário confirmou na conversa
- `[sugerido]` — Claude propôs, ainda não confirmado
- `[assumido]` — sem sinal, placeholder a validar

## Exemplo preenchido

| Estágio | O que o cliente quer | O que trava |
|---------|---------------------|-------------|
| Descoberta | `[validado]` Saber se a loja oferece recarga | `[sugerido]` Não há sinalização visível no PDV |
| Abertura do app | `[validado]` Acessar o recarregador rapidamente | `[assumido]` QR code no caixa pode não ser óbvio |
| Seleção de operadora | `[validado]` Escolher a operadora do chip dele | `[sugerido]` Cliente não lembra qual é a operadora |
| Confirmação do valor | `[validado]` Ver quanto vai ser cobrado antes de pagar | `[validado]` Medo de ser cobrado errado |
| Pagamento | `[validado]` Pagar de forma rápida e segura | `[sugerido]` Só cartão salvo, não aceita PIX |
| Confirmação | `[validado]` Saber que a recarga caiu | `[assumido]` Pode não receber SMS de confirmação |

## Quando escalar para JTBD (5 colunas)

Escalar apenas se:
- A distinção entre **intenção** (job) e **ação** realmente importa pro produto
- Há um **sinal de sucesso** distinto por estágio que o usuário quer rastrear
- O usuário explicitamente pede JTBD

**Caso contrário, Pareto vence.** Simplicity First.
