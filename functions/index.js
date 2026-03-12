const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();

// Configura tu API Key de Resend en Firebase:
// firebase functions:config:set resend.key="TU_API_KEY"
const ADMIN_EMAIL = "aquinterol.0529@gmail.com";

exports.onAuthUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  // 1) Guardar usuario en Firestore (redundante pero seguro)
  await db.collection("users").doc(user.uid).set({
    email: user.email || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    role: "student"
  }, { merge: true });

  // 2) Registrar evento de registro
  await db.collection("events").add({
    uid: user.uid,
    type: "REGISTERED",
    payload: { email: user.email || null },
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // 3) Enviar email al admin
  const resendApiKey = functions.config().resend.key;
  if (!resendApiKey) return;

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: "Tu Aula Virtual <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: "Nuevo registro en Tu Aula Virtual Inteligente",
      html: `
        <h3>¡Nuevo usuario registrado!</h3>
        <p><b>Email:</b> ${user.email || "Sin email"}</p>
        <p><b>UID:</b> ${user.uid}</p>
        <p><b>Fecha:</b> ${new Date().toISOString()}</p>
      `
    });
  } catch (error) {
    console.error("Error enviando email:", error);
  }
});

exports.onCourseCreated = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snapshot) => {
    const event = snapshot.data();
    if (event.type !== "COURSE_CREATED") return;

    const resendApiKey = functions.config().resend.key;
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: "Tu Aula Virtual <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: "Nuevo curso generado",
        html: `
          <h3>Un usuario ha generado un curso</h3>
          <p><b>UID:</b> ${event.uid}</p>
          <p><b>Tema:</b> ${event.payload.topic}</p>
          <p><b>Nivel:</b> ${event.payload.level}</p>
          <p><b>Fecha:</b> ${new Date().toISOString()}</p>
        `
      });
    } catch (error) {
      console.error("Error enviando email de curso:", error);
    }
  });
