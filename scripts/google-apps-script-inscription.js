/**
 * ============================================
 * TravelAgencies.World - Inscription Form
 * Google Apps Script pour gérer les inscriptions
 * ============================================
 * 
 * INSTRUCTIONS D'INSTALLATION:
 * 1. Allez sur https://script.google.com
 * 2. Créez un nouveau projet
 * 3. Copiez ce code
 * 4. Exécutez la fonction createInscriptionForm()
 * 5. Autorisez les permissions demandées
 * 6. Le formulaire sera créé et lié à une feuille Google Sheets
 */

// Configuration
const CONFIG = {
  formTitle: "🇲🇦 Inscription Agence de Voyage - TravelAgencies.World",
  formDescription: `Bienvenue sur le formulaire d'inscription pour référencer votre agence de voyage sur TravelAgencies.World.

📋 TARIF: 500 DH (paiement unique - inscription à vie)

💳 COORDONNÉES BANCAIRES:
• Titulaire: M. OUSSAMA MOUNAJJIM
• RIB: 011 791 0000022000002914 19
• IBAN: MA64 0117 9100 0002 2000 0029 1419
• BIC: BMCEMAMC

📱 Après paiement, envoyez votre reçu sur WhatsApp: +33 7 45 07 56 68

⚽ Profitez de la CAN 2025 au Maroc pour augmenter votre visibilité!`,
  
  spreadsheetName: "Inscriptions TravelAgencies.World",
  notificationEmail: "votre-email@example.com", // Changez ceci
  whatsappNumber: "+33745075668"
};

/**
 * Crée le formulaire d'inscription
 */
function createInscriptionForm() {
  // Créer le formulaire
  const form = FormApp.create(CONFIG.formTitle);
  form.setDescription(CONFIG.formDescription);
  form.setConfirmationMessage(
    "✅ Merci pour votre inscription!\n\n" +
    "📧 Nous avons bien reçu vos informations.\n\n" +
    "⏳ Prochaines étapes:\n" +
    "1. Effectuez le virement de 500 DH\n" +
    "2. Envoyez le reçu sur WhatsApp: +33 7 45 07 56 68\n" +
    "3. Votre agence sera en ligne sous 24h!\n\n" +
    "🇲🇦 À très bientôt sur TravelAgencies.World!"
  );
  form.setCollectEmail(true);
  form.setAllowResponseEdits(true);
  form.setLimitOneResponsePerUser(false);

  // Section 1: Informations de l'agence
  form.addSectionHeaderItem()
    .setTitle("📍 Informations de l'Agence")
    .setHelpText("Veuillez remplir les informations de votre agence de voyage");

  form.addTextItem()
    .setTitle("Nom de l'agence")
    .setHelpText("Ex: Atlas Voyages, Maroc Tours, etc.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Slogan / Description courte")
    .setHelpText("Une phrase qui décrit votre agence (max 100 caractères)")
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Description complète")
    .setHelpText("Décrivez vos services, spécialités, expérience, etc. (200-500 caractères)")
    .setRequired(true);

  // Section 2: Coordonnées
  form.addSectionHeaderItem()
    .setTitle("📞 Coordonnées")
    .setHelpText("Comment vos clients peuvent vous contacter");

  form.addTextItem()
    .setTitle("Adresse complète")
    .setHelpText("Ex: 123 Avenue Mohammed V, Casablanca 20000")
    .setRequired(true);

  const villeItem = form.addMultipleChoiceItem()
    .setTitle("Ville")
    .setRequired(true)
    .setChoiceValues([
      "Casablanca",
      "Rabat",
      "Marrakech",
      "Fès",
      "Tanger",
      "Agadir",
      "Meknès",
      "Oujda",
      "Kénitra",
      "Tétouan",
      "Salé",
      "Nador",
      "El Jadida",
      "Essaouira",
      "Ouarzazate",
      "Autre"
    ]);

  form.addTextItem()
    .setTitle("Si 'Autre', précisez la ville")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Numéro de téléphone principal")
    .setHelpText("Ex: +212 5 22 XX XX XX")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Numéro WhatsApp")
    .setHelpText("Ex: +212 6 XX XX XX XX")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Email professionnel")
    .setHelpText("Ex: contact@votreagence.ma")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Site web")
    .setHelpText("Ex: https://www.votreagence.ma (laissez vide si vous n'en avez pas)")
    .setRequired(false);

  // Section 3: Réseaux sociaux
  form.addSectionHeaderItem()
    .setTitle("📱 Réseaux Sociaux")
    .setHelpText("Optionnel - pour augmenter votre visibilité");

  form.addTextItem()
    .setTitle("Page Facebook")
    .setHelpText("Ex: https://facebook.com/votreagence")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Compte Instagram")
    .setHelpText("Ex: @votreagence ou https://instagram.com/votreagence")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Lien Google Maps")
    .setHelpText("Copiez le lien de votre fiche Google Maps si vous en avez une")
    .setRequired(false);

  // Section 4: Services
  form.addSectionHeaderItem()
    .setTitle("✈️ Services Proposés")
    .setHelpText("Quels services offrez-vous?");

  form.addCheckboxItem()
    .setTitle("Types de services")
    .setRequired(true)
    .setChoiceValues([
      "Billets d'avion",
      "Réservation d'hôtels",
      "Circuits organisés",
      "Location de voitures",
      "Visa et assistance administrative",
      "Voyages organisés (groupes)",
      "Voyages sur mesure",
      "Excursions et activités",
      "Transferts aéroport",
      "Croisières",
      "Omra et Hajj",
      "Voyages d'affaires",
      "Événements et séminaires",
      "Autre"
    ]);

  form.addCheckboxItem()
    .setTitle("Destinations principales")
    .setRequired(true)
    .setChoiceValues([
      "Maroc (tourisme national)",
      "Europe",
      "Moyen-Orient",
      "Afrique",
      "Asie",
      "Amérique du Nord",
      "Amérique du Sud",
      "Océanie",
      "Destinations Omra/Hajj"
    ]);

  // Section 5: Informations complémentaires
  form.addSectionHeaderItem()
    .setTitle("ℹ️ Informations Complémentaires");

  form.addTextItem()
    .setTitle("Année de création de l'agence")
    .setHelpText("Ex: 2010")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Numéro de licence / Patente")
    .setHelpText("Votre numéro d'agrément de voyage (optionnel)")
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle("Comment avez-vous entendu parler de nous?")
    .setRequired(false)
    .setChoiceValues([
      "Recherche Google",
      "Réseaux sociaux",
      "Recommandation d'un ami/collègue",
      "WhatsApp",
      "Publicité",
      "Autre"
    ]);

  // Section 6: Paiement
  form.addSectionHeaderItem()
    .setTitle("💳 Confirmation de Paiement")
    .setHelpText("Important: Votre inscription sera activée après réception du paiement");

  form.addMultipleChoiceItem()
    .setTitle("Statut du paiement")
    .setRequired(true)
    .setChoiceValues([
      "J'ai déjà effectué le virement de 500 DH",
      "Je vais effectuer le virement aujourd'hui",
      "Je vais effectuer le virement cette semaine",
      "J'ai des questions avant de payer"
    ]);

  form.addTextItem()
    .setTitle("Référence du virement (si déjà effectué)")
    .setHelpText("Le numéro de référence de votre virement bancaire")
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Questions ou remarques")
    .setHelpText("Si vous avez des questions, écrivez-les ici")
    .setRequired(false);

  // Créer la feuille de calcul liée
  const spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // Formater la feuille
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName("Inscriptions");
  
  // Ajouter une feuille de suivi
  const trackingSheet = spreadsheet.insertSheet("Suivi Paiements");
  trackingSheet.getRange("A1:F1").setValues([[
    "Email", "Agence", "Date Inscription", "Paiement Reçu", "Date Activation", "Statut"
  ]]);
  trackingSheet.getRange("A1:F1").setFontWeight("bold").setBackground("#4CAF50").setFontColor("white");

  // Configurer le trigger pour les notifications
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  // Afficher les URLs
  const formUrl = form.getPublishedUrl();
  const editUrl = form.getEditUrl();
  const spreadsheetUrl = spreadsheet.getUrl();

  Logger.log("=".repeat(60));
  Logger.log("✅ FORMULAIRE CRÉÉ AVEC SUCCÈS!");
  Logger.log("=".repeat(60));
  Logger.log("");
  Logger.log("📋 URL du formulaire (à partager):");
  Logger.log(formUrl);
  Logger.log("");
  Logger.log("✏️ URL pour modifier le formulaire:");
  Logger.log(editUrl);
  Logger.log("");
  Logger.log("📊 URL de la feuille de réponses:");
  Logger.log(spreadsheetUrl);
  Logger.log("");
  Logger.log("=".repeat(60));

  // Créer un document récapitulatif
  const doc = DocumentApp.create("URLs TravelAgencies.World - Inscription");
  const body = doc.getBody();
  body.appendParagraph("TravelAgencies.World - URLs d'Inscription").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph("");
  body.appendParagraph("URL du formulaire (à partager):").setBold(true);
  body.appendParagraph(formUrl);
  body.appendParagraph("");
  body.appendParagraph("URL pour modifier le formulaire:").setBold(true);
  body.appendParagraph(editUrl);
  body.appendParagraph("");
  body.appendParagraph("URL de la feuille de réponses:").setBold(true);
  body.appendParagraph(spreadsheetUrl);

  return {
    formUrl: formUrl,
    editUrl: editUrl,
    spreadsheetUrl: spreadsheetUrl
  };
}

/**
 * Fonction appelée lors de la soumission du formulaire
 */
function onFormSubmit(e) {
  try {
    const response = e.response;
    const itemResponses = response.getItemResponses();
    
    // Extraire les données importantes
    let agencyName = "";
    let email = response.getRespondentEmail();
    let phone = "";
    let city = "";
    let paymentStatus = "";
    
    for (const itemResponse of itemResponses) {
      const title = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      
      if (title.includes("Nom de l'agence")) agencyName = answer;
      if (title.includes("téléphone principal")) phone = answer;
      if (title.includes("Ville") && !title.includes("Autre")) city = answer;
      if (title.includes("Statut du paiement")) paymentStatus = answer;
    }
    
    // Envoyer notification par email
    sendNotificationEmail(agencyName, email, phone, city, paymentStatus);
    
    // Log
    Logger.log(`Nouvelle inscription: ${agencyName} - ${email}`);
    
  } catch (error) {
    Logger.log("Erreur dans onFormSubmit: " + error.toString());
  }
}

/**
 * Envoie un email de notification pour chaque nouvelle inscription
 */
function sendNotificationEmail(agencyName, email, phone, city, paymentStatus) {
  const subject = `🇲🇦 Nouvelle inscription: ${agencyName} - TravelAgencies.World`;
  
  const body = `
Nouvelle inscription sur TravelAgencies.World!
================================================

📍 INFORMATIONS DE L'AGENCE:
• Nom: ${agencyName}
• Ville: ${city}
• Email: ${email}
• Téléphone: ${phone}

💳 STATUT PAIEMENT: ${paymentStatus}

📋 ACTIONS À FAIRE:
${paymentStatus.includes("déjà effectué") ? 
  "✅ Vérifier le paiement et activer l'agence" : 
  "⏳ Attendre le paiement et le reçu sur WhatsApp"}

🔗 Voir toutes les inscriptions:
https://docs.google.com/spreadsheets

---
TravelAgencies.World - Annuaire Mondial des Agences de Voyage
`;

  // Envoyer l'email (décommentez et ajoutez votre email)
  // MailApp.sendEmail(CONFIG.notificationEmail, subject, body);
  
  Logger.log("Email de notification préparé pour: " + agencyName);
}

/**
 * Génère un message WhatsApp de confirmation
 */
function generateWhatsAppMessage(agencyName, email) {
  const message = encodeURIComponent(
    `Bonjour! 👋\n\n` +
    `Merci pour votre inscription de "${agencyName}" sur TravelAgencies.World! 🇲🇦\n\n` +
    `📋 Prochaines étapes:\n` +
    `1. Effectuez le virement de 500 DH\n` +
    `2. Envoyez-nous le reçu ici\n\n` +
    `💳 Coordonnées bancaires:\n` +
    `• Titulaire: M. OUSSAMA MOUNAJJIM\n` +
    `• IBAN: MA64 0117 9100 0002 2000 0029 1419\n` +
    `• BIC: BMCEMAMC\n\n` +
    `Votre agence sera en ligne sous 24h après réception! ⚽🏆\n\n` +
    `À très bientôt!`
  );
  
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
}

/**
 * Fonction pour créer un menu personnalisé dans la feuille
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🇲🇦 TravelAgencies')
    .addItem('📧 Envoyer rappel paiement', 'sendPaymentReminder')
    .addItem('✅ Marquer comme payé', 'markAsPaid')
    .addItem('📊 Générer rapport', 'generateReport')
    .addToUi();
}

/**
 * Envoie un rappel de paiement
 */
function sendPaymentReminder() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Envoyer rappel',
    'Entrez l\'email de l\'agence:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() == ui.Button.OK) {
    const email = result.getResponseText();
    // Logique d'envoi de rappel
    ui.alert('Rappel envoyé à ' + email);
  }
}

/**
 * Marque une inscription comme payée
 */
function markAsPaid() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  
  if (range) {
    range.setBackground("#4CAF50");
    SpreadsheetApp.getUi().alert("✅ Marqué comme payé!");
  }
}

/**
 * Génère un rapport des inscriptions
 */
function generateReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inscriptions");
  const data = sheet.getDataRange().getValues();
  
  const totalInscriptions = data.length - 1; // Moins l'en-tête
  
  SpreadsheetApp.getUi().alert(
    `📊 Rapport TravelAgencies.World\n\n` +
    `Total inscriptions: ${totalInscriptions}\n` +
    `Date: ${new Date().toLocaleDateString('fr-FR')}`
  );
}

/**
 * INSTRUCTION: Exécutez d'abord createInscriptionForm()
 * pour créer le formulaire et la feuille de calcul.
 */
