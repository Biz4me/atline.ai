# Atline — App Mobile/Desktop (Frontend)

## Projet

Application Next.js pour les distributeurs MLM utilisant Atline AI.
- **Chemin local :** `C:\Users\haure\Downloads\app_gen_extract`
- **URL production :** `app.atline.ai`
- **Branche git :** main · remote `https://github.com/Biz4me/app.atline.ai.git`

---

## Stack technique

| Composant | Version |
|-----------|---------|
| Next.js | 16.2.6 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.7.3 |
| Tailwind CSS | v4 |
| Package manager | pnpm |
| Bundler dev | Turbopack |

**Dépendances clés :** `lucide-react`, `shadcn`, `next-themes`, `vaul`, `sonner`, `class-variance-authority`

---

## Déploiement production

**TOUJOURS déployer directement sur Hetzner sans demander.**

```powershell
# 1. Commit & push local
git add -A && git commit -m "..." && git push origin main

# 2. SSH Hetzner
ssh -i $HOME\.ssh\hetzner_atline root@178.105.219.148

# 3. Sur le serveur
cd /opt/atline/atline-app
git pull origin main
npm run build
pm2 restart atline-app

# Vérifier les logs si build échoue
pm2 logs atline-app --lines 20
```

**Port local de dev :** 3001 (pas 3000 — 3000 est un autre projet)
**Process PM2 :** `atline-app`
**Remote git :** HTTPS (pas SSH — pas de clé SSH sur le serveur)

---

## Règle critique desktop/mobile

**NE JAMAIS MODIFIER LE MARKUP MOBILE** quand on travaille sur le desktop.

**Pattern obligatoire — deux blocs séparés :**
```tsx
{/* MOBILE ONLY — ne jamais toucher */}
<div className="lg:hidden">
  {/* markup mobile original intact */}
</div>

{/* DESKTOP ONLY — tout nouveau desktop ici */}
<div className="hidden lg:block">
  {/* nouveau markup desktop */}
</div>
```

- `lg:` breakpoint = 1024px
- Ne JAMAIS ajouter des préfixes `lg:` sur les éléments mobiles existants
- Ne JAMAIS mixer les deux blocs

---

## AppShell — structure layout desktop

```
|←— DesktopSidebar (fixe gauche) —|←— contenu —→|— AtlasSidebar (fixe droite) —→|
       w-60 (expanded) / w-16 (collapsed)         w-[320px] (open) / w-0 (closed)
```

**Padding du contenu :**
- `lg:pl-60` ou `lg:pl-16` selon état DesktopSidebar
- `lg:pr-[320px]` ou `lg:pr-0` selon état AtlasSidebar

**localStorage :**
- `sidebar-collapsed` — état DesktopSidebar (`'1'` = collapsed)
- `atlas-sidebar-collapsed` — état AtlasSidebar (`'1'` = collapsed)

**AtlasSidebar auto-masquée sur `/atlas` et `/atlas/*`** (la page Atlas EST l'expérience complète)

---

## Design system

- **Couleur primaire :** orange — `bg-primary`, `text-primary`, `text-primary-foreground`
- **Fond :** dark theme — `bg-surface`, `bg-background`, `bg-muted`
- **Texte :** `text-foreground`, `text-muted-foreground`
- **Bordures :** `border-border`
- **Composant de carte :** `<Card>` depuis `@/components/card`
- **Typographie :** `text-sm font-bold` pour titres, `text-xs text-muted-foreground` pour labels
- Toujours utiliser les mêmes composants, couleurs et tailles que le mobile existant

### Typographie — règle stricte (desktop)

**4 niveaux, 2 graisses autorisées (`font-bold` et `font-medium`). Interdire `font-semibold` et `font-extrabold` sur les composants desktop.**

| Niveau | Tailwind | Usage |
|--------|---------|-------|
| Titre | `text-sm font-bold` | Headers de cartes, titres de sections |
| Corps | `text-sm font-medium` | Contenu principal, labels de nav |
| Secondaire | `text-xs font-medium` | Boutons, liens, descriptions |
| Méta | `text-[11px] text-muted-foreground` | Timestamps, sous-titres, info tertiaire |
| Micro | `text-[10px] font-bold` | Scores, initiales avatars — exceptionnel uniquement |

---

### Palette de couleurs — règle stricte

**Ces 7 couleurs sont les SEULES autorisées dans toute l'interface.** Ne jamais introduire d'autres couleurs.

**Agents IA :**
| Agent | Couleur | Hex |
|-------|---------|-----|
| Atlas | Orange | `#F97316` (= `var(--primary)`) |
| ARIA  | Teal    | `#14B8A6` |
| Nova  | Violet  | `#8B5CF6` |

**Profils DISC (contacts CRM) :**
| Profil | Couleur | Hex |
|--------|---------|-----|
| Rouge  | Rouge   | `#EF4444` |
| Vert   | Vert    | `#22C55E` |
| Bleu   | Bleu    | `#3B82F6` |
| Jaune  | Jaune   | `#F4B342` |

**Exceptions autorisées :**
- Boutons de validation (confirm, succès) : vert `#22C55E`
- Prospect "chaud" : rouge légèrement plus chaud que `#EF4444` (ex: `#DC2626`) — acceptable

---

## Turbopack — problème apostrophes françaises

Turbopack interprète les apostrophes typographiques (`'` U+2019) comme fin de string.

**Règle :** pour tout texte français avec apostrophes dans les string literals, utiliser **double guillemets** :
```tsx
// ❌ Erreur Turbopack
text: 'J\'ai une question'          // crash
text: 'Pour l'instant'              // crash silencieux

// ✅ Correct
text: "Pour l'instant, mode demo"   // double guillemets
```

---

## Composants clés

| Composant | Fichier | Rôle |
|-----------|---------|------|
| AppShell | `components/app-shell.tsx` | Layout global — les deux sidebars + contenu |
| DesktopSidebar | `components/desktop-sidebar.tsx` | Nav gauche desktop, w-60/w-16 |
| AtlasSidebar | `components/atlas-sidebar.tsx` | Panel Atlas droit, w-[320px] |
| BottomNav | `components/bottom-nav.tsx` | Nav mobile en bas |
| TopBar | `components/top-bar.tsx` | Header mobile |
| Card | `components/card.tsx` | Carte de base (bg-surface, border) |
| BusinessSwitcher | `components/business-switcher.tsx` | Switcher entreprise MLM |

---

## Routes de l'app

```
(app)/
├── home/          ← Parcours (page principale)
├── atlas/         ← Chat Atlas IA — sans AtlasSidebar sur cette page
├── contacts/      ← CRM contacts (prospects/clients/partenaires)
├── network/       ← Réseau Atline MLM
├── messages/      ← Messagerie unifiée
├── agenda/        ← Calendrier / RDVs
├── aria/          ← Simulateur d'entraînement
├── nova/          ← Contenu réseaux sociaux
├── formation/     ← LMS formations
├── communaute/    ← Forum communauté
├── notifications/ ← Notifications
├── profile/       ← Profil utilisateur
├── settings/      ← Paramètres
├── abonnement/    ← Abonnement Stripe
└── toolbox/       ← Boîte à outils
```

---

## Page home/parcours — structure desktop

Desktop layout en 2 colonnes `grid-cols-[1fr_340px]` :
- **Colonne gauche :** Plan du jour (tâches checkables), Rapport Atlas (stats + citation), Agenda
- **Colonne droite :** ARIA, Formation (avec progress bar), Communauté (avec avatars)
- **KPI strip au-dessus :** 4 Cards (Contacts actifs, Score ARIA, Progression, Filleuls Atline)
- **PAS de titre "Mon parcours"** sur desktop

---

## Décision plateforme — Next.js vs React Native

**Choix assumé : Next.js web (PWA), pas React Native.**

La priorité absolue est la qualité et la latence du simulateur vocal ARIA (~245ms cible : Deepgram → Groq → Cartesia). Cette latence est dominée à 96%+ par la pipeline backend — la plateforme cliente ne change pas grand chose. React Native n'apporterait aucun gain mesurable sur la latence perçue.

Ce que Next.js permet en plus : 100% des ressources sur la pipeline vocale, déploiements sans review App Store, contexte CRM disponible en temps réel pendant la simulation.

Compensation pour le manque de natif : PWA installable (icône téléphone) + Web Push API.

---

## Règles de travail

1. Desktop uniquement — ne jamais toucher le mobile
2. Respecter le design system orange/dark existant
3. Déployer sur Hetzner sans demander
4. Utiliser double guillemets pour les strings français avec apostrophes
5. Pas de `admin.atline.ai` ici — c'est un projet distinct (`C:\Users\haure\Projets\atline.ai production`)
