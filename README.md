## https.jetzt!

Dieses Projekt bietet eine Übersicht, ob Domains deutscher Behörden das HTTPS-Protokoll (<code>https://</code>) unterstützen, und - falls ja - wie stark diese Unterstützung ist.

Entstanden am [OpenDataDay 2016](http://de.opendataday.org).
Domains aus dem [german-gov-domains](https://github.com/robbi5/german-gov-domains)-Datensatz.

Basierend auf [the pulse of the federal .gov webspace (pulse.cio.gov)](https://pulse.cio.gov) von [18F](https://18f.gsa.gov)/[General Services Administration](http://gsa.gov).

Dieses Repository ist somit ein Fork von [18F/pulse](https://github.com/18F/pulse) - die originale Readme hängt unten an.

### Neue Domains hinzufügen/Neu scannen:

Die Domains am besten dem [german-gov-domains](https://github.com/robbi5/german-gov-domains)-Datensatz hinzufügen.

Danach lassen sich mit Hilfe des [`domain-scan`-Containers](https://github.com/18F/domain-scan) neue scan-Ergebnisse erzeugen: `make update_httpsjetzt`

---

## The pulse of the federal .gov webspace

How the .gov domain space is doing at best practices and federal requirements.

| Documentation  |  Other Links |
|---|---|
| [Setup and Deploy Instructions](https://github.com/18F/pulse/blob/master/docs/setup.md)  |  [System Security Plan](https://github.com/18F/pulse/blob/master/system-security-plan.yml) |
| [a11y scan process](https://github.com/18F/pulse/blob/master/docs/a11y-instructions.md)  | [Ideas for new sections to add to the site](https://github.com/18F/pulse/blob/master/docs/other-sections.md) |
| [Ongoing Work](https://github.com/18F/pulse/blob/master/docs/project-outline.md) | [Backlog of feature requests and ideas](https://github.com/18F/pulse/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Abacklog)  | 
|  [ATO artifacts](https://github.com/18F/pulse/blob/master/docs/ato.md)  | [Open Source Reuse of the site](https://github.com/18F/pulse/blob/master/docs/reuse.md) |
| [Project Information](https://github.com/18F/pulse/blob/master/.about.yml)  |  |


### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
