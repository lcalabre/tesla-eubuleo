# Contenuto del repository pubblico `tesla-eubuleo`

Questa cartella si carica **così com'è** in un repository GitHub pubblico, e diventa
`https://tesla.eubuleo.it`. Serve a due cose: la chiave pubblica che Tesla deve poter leggere
(passo 0 della guida) e le pagine che devono girare fuori da una cornice, come il tachimetro,
perché il GPS dentro un iframe viene rifiutato.

## I file

| File | A cosa serve |
|---|---|
| `.nojekyll` | **vuoto ma indispensabile**: senza, GitHub Pages passa tutto da Jekyll, che ignora le cartelle che iniziano con un punto, e `.well-known` non viene pubblicata |
| `CNAME.da-attivare` | contiene `tesla.eubuleo.it`. **Va rinominato in `CNAME` solo dopo** aver creato il record DNS: con quel file presente, Pages rimanda l'indirizzo github.io al dominio, e finché il dominio non risolve il sito risulta irraggiungibile |
| `index.html` | l'elenco degli strumenti |
| `tachimetro.html` | il tachimetro GPS |
| `.well-known/appspecific/` | **qui dentro va `com.tesla.3p.public-key.pem`**, generata al passo 2 della guida |

## Regola sulle chiavi

In questo repository va **solo** `com.tesla.3p.public-key.pem`, che è pubblica per definizione.
**`private-key.pem` non entra qui e non entra da nessuna parte su GitHub**: sta sul PC e in KeePass.
Attenzione se copi qui il `.gitignore` del progetto: quello esclude `*.pem`, e qui invece la chiave
pubblica **deve** essere committata, altrimenti Tesla non la trova.

## Come si pubblica, la prima volta

```bash
cd PERSONALE/Progetto_Tesla/sito
git init -b main
git add -A
git commit -m "strumenti di bordo"
gh repo create tesla-eubuleo --public --source=. --push
```

Poi su GitHub: **Settings → Pages**, Source `Deploy from a branch`, branch `main`, cartella `/root`.
Il campo *Custom domain* si riempie da solo leggendo il file `CNAME`.

## Prima che il dominio funzioni

Appena Pages è attiva, il sito è già raggiungibile senza DNS a
`https://lcalabre.github.io/tesla-eubuleo/`, ed è un indirizzo vero: **il GPS lì funziona**.
Il record `CNAME tesla → lcalabre.github.io` e il certificato servono solo per avere il nome bello.

## Quando cambia il tachimetro

`python pubblica_sito.py` dalla cartella del progetto ricopia qui la versione aggiornata, poi
`git add -A && git commit -m "..." && git push`.
