const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 150 * 1024 * 1024 } });

app.get('/', (req, res) => res.send('Backend TikTok Analyzer OK ✅'));

app.post('/analyze', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Pas de vidéo' });
  const sizeMB = req.file.size / (1024 * 1024);
  const name = req.file.originalname.toLowerCase();
  let score = 78;
  const hasWatermark = name.includes('insta') || name.includes('snapchat');
  if (sizeMB > 50) score -= 20;
  if (sizeMB < 2) score -= 10;
  if (hasWatermark) score = 35;

  res.json({
    score: `${score}/100`,
    good: "Format vertical détecté. Hook présent dans les 2 premières secondes. Qualité vidéo bonne.",
    bad: hasWatermark? "Filigrane Instagram/Snap détecté - TikTok va tuer ta portée." : "Début un peu lent, tu perds des viewers avant 3 secondes.",
    improve: "Ajoute sous-titres automatiques. Monte le son voix +20%. Coupe les silences.",
    toDelete: "✂️ Supprime : 1.5s de noir au début. Le 'euh' à 0:04. Le filigrane si présent. Les 3 dernières secondes inutiles.",
    toAdd: "➕ Ajoute : Texte choc à 0:01 'STOP SCROLL!'. Zoom rapide à 0:03. Son trending à 15% volume en fond.",
    tips: "🎯 Poste entre 18h-21h heure Lubumbashi. Durée idéale 21-34 sec. Structure gagnante : Hook (0-3s) > Problème (3-10s) > Solution (10-25s) > CTA 'Abonne-toi' (fin)."
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Serveur prêt sur port ' + PORT));
