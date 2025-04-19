🔹 **Hauptidee:**  
Ein scrollbares(chat ähnliches), interaktives Lernportal für Python, ohne Page-Reloads – gehostet mit Cloudflare Pages + Workers.

🔹 **Layout-Struktur (Single Page App):**  
1. **🧭 Seitenleiste oder Top-Navigation:**  
   - Kapitel (z. B. "Variablen", "Schleifen", "Funktionen")  
   - Abschnitte/Lektionen auswählbar  
   - Optional: Fortschrittsbalken oder Checkboxen

2. **📜 Hauptbereich (scrollbar):**  
   - Markdown-ähnlicher Lerntext mit Formatierungen  
   - Eingebettete **Code-Snippets mit "Run"-Button**  
   - Code-Ausgabe direkt darunter  
   - Kleine Wissensfragen / Multiple-Choice-Blöcke  
   - Links zu tiefergehenden Themen

3. **🧪 Quiz- & Prüfungsmodus (optional als eigene Seiten):**  
   - Zusammenfassungen + Prüfungsfragen  
   - Punkte/Erfolg sichtbar am Ende

4. **📬 API-Calls im Hintergrund (via Worker):**  
   - "Run Python"-Button sendet Code an Worker  
   - Ergebnis kommt zurück → wird angezeigt (ohne Reload)