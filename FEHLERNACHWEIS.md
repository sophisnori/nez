# Nachweis: Absichtliche Rechtschreibfehler

Die drei erfundenen Artikel der «Neuen Eidgenössischen Zeitung» enthalten absichtlich je **zwei Rechtschreibfehler**, insgesamt sechs. Sie sind ein typisches Fake-Merkmal: Echte Redaktionen haben ein Korrektorat, Fake-Seiten oft nicht.

Die Fehler stehen nur im Fliesstext. Titel, Untertitel, Bildlegenden und Forum sind fehlerfrei, damit der erste Eindruck professionell bleibt. Der echte Artikel über Sam Altman (`altman-ram.html`) enthält keine Fehler.

## Übersicht

| Nr. | Artikel | Fehler | Richtig |
|---|---|---|---|
| 1 | Bevölkerungsobergrenze | Stimmbeteilligung | Stimmbeteiligung |
| 2 | Bevölkerungsobergrenze | seperaten | separaten |
| 3 | EMP-Waffe | Unabhänig | Unabhängig |
| 4 | EMP-Waffe | Warscheinlichkeit | Wahrscheinlichkeit |
| 5 | Voyager-Signal | identifitziert | identifiziert |
| 6 | Voyager-Signal | Telefonkonferrenz | Telefonkonferenz |

## Fundstellen im Detail

### Artikel 1: «Nach knappem Ja zur Bevölkerungsobergrenze: Bundesrat schlägt Ausschaffungen vor»
Datei: `bevoelkerungsobergrenze.html`

**Fehler 1: «Stimmbeteilligung»**
- Wo: erster Absatz (beginnt mit «Bern – Wie am … bekannt wurde»), letzter Satz
- Satz: «Die **Stimmbeteilligung** lag laut Bundeskanzlei bei 49,2 Prozent.»
- Richtig: Stimmbeteiligung (nur ein *l*)

**Fehler 2: «seperaten»**
- Wo: Abschnitt «Ausnahmen für EU-Bürger vorerst offen», erster Absatz
- Satz: «Die Vereinbarkeit mit dem Freizügigkeitsabkommen werde in einem **seperaten** Gutachten des Bundesamts für Justiz geprüft (Dokument BJ-GA-2026-044).»
- Richtig: separaten (mit *a* nach dem *p*)

### Artikel 2: «Russland präsentiert neue EMP-Waffe: USIA warnt vor Angriff auf das Baltikum»
Datei: `emp-waffe-baltikum.html`

**Fehler 3: «Unabhänig»**
- Wo: zweiter Absatz (beginnt mit «Nach Angaben des Ministeriums»), letzter Satz
- Satz: «**Unabhänig** überprüfen lassen sich diese Angaben nicht.»
- Richtig: Unabhängig (mit *g* am Ende)

**Fehler 4: «Warscheinlichkeit»**
- Wo: Abschnitt «Geleaktes Briefing», erster Absatz, im Zitat aus dem Briefing
- Satz: «Darin heisst es, «Sarniza-M» sei «mit hoher **Warscheinlichkeit**» für einen Konflikt um die baltischen Staaten vorgesehen.»
- Richtig: Wahrscheinlichkeit (mit *h* nach dem *a*)

### Artikel 3: «Voyager 1 empfängt Signal: Regierungen wollen «Kontakt aufnehmen»»
Datei: `voyager-signal.html`

**Fehler 5: «identifitziert»**
- Wo: erster Absatz (beginnt mit «Pasadena – Wie die US-Raumfahrtbehörde NASA»), erster Satz
- Satz: «… haben Forschende am Jet Propulsion Laboratory (JPL) in Daten der Raumsonde Voyager 1 ein wiederkehrendes Muster **identifitziert**.»
- Richtig: identifiziert (ohne *t* vor dem *z*)

**Fehler 6: «Telefonkonferrenz»**
- Wo: Absatz direkt nach dem Zitat «Wir sind selbst überrascht.», erster Satz
- Satz: «… sagte Dr. Miriam Okafor-Lindqvist, Projektwissenschaftlerin am JPL, an einer **Telefonkonferrenz** mit Medienvertretern.»
- Richtig: Telefonkonferenz (nur ein *r*)

## Prüfen

Im Browser auf der jeweiligen Seite mit `Strg + F` (Mac: `Cmd + F`) nach dem falschen Wort suchen, oder im Repository:

```bash
grep -n "Stimmbeteilligung\|seperaten\|Unabhänig\|Warscheinlichkeit\|identifitziert\|Telefonkonferrenz" *.html
```
