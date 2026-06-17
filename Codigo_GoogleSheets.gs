/* =====================================================================
   MM COMMERCE — Formulario de cotización → Google Sheets + Correo
   ---------------------------------------------------------------------
   Cómo usarlo:
   1. Abre tu hoja de Google Sheets ("Leads MM Commerce").
   2. Menú  Extensiones → Apps Script.
   3. Borra todo lo que haya y pega ESTE código completo.
   4. Guarda (💾).
   5. Implementar → Nueva implementación → Aplicación web
        · Ejecutar como: Yo
        · Quién tiene acceso: Cualquier usuario   (¡importante!)
   6. Autoriza permisos y copia la URL que termina en /exec.
      (Esa URL ya está pegada en el index.html actual: si la cambias,
       actualízala en la variable APPS_SCRIPT_URL del index.)

   Encabezados sugeridos en la fila 1 (columnas A–L):
   Fecha · Nombre · Teléfono · Tipo de cliente · Producto · Metros · Altura · Puerta peatonal (1m) · Portón (4m) · Zona · Mensaje · Origen
===================================================================== */

// ===== CONFIGURACIÓN =====
var CORREO_DESTINO = "mmcommerce2025@gmail.com"; // a dónde llegan los leads
var NOMBRE_HOJA    = "Hoja 1"; // nombre de la pestaña (ajústalo si lo cambiaste)
// =========================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // 1) Guardar en Google Sheets
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName(NOMBRE_HOJA) || ss.getSheets()[0];
    hoja.appendRow([
      data.fecha    || new Date().toLocaleString("es-MX"),
      data.nombre   || "",
      data.telefono || "",
      data.tipo     || "",
      data.producto || "",
      data.metros   || "",
      data.altura   || "",
      data.puerta   || "No",
      data.porton   || "No",
      data.zona     || "",
      data.mensaje  || "",
      data.origen   || "Landing"
    ]);

    // 2) Enviar correo de aviso
    var cuerpo =
      "Nuevo lead de cotización — MM Commerce\n\n" +
      "Nombre:    " + (data.nombre   || "") + "\n" +
      "Teléfono:  " + (data.telefono || "") + "\n" +
      "Tipo:      " + (data.tipo     || "") + "\n" +
      "Producto:  " + (data.producto || "") + "\n" +
      "Metros:    " + (data.metros   || "") + "\n" +
      "Altura:    " + (data.altura   || "") + "\n" +
      "Puerta 1m: " + (data.puerta   || "No") + "\n" +
      "Portón 4m: " + (data.porton   || "No") + "\n" +
      "Zona:      " + (data.zona     || "") + "\n" +
      "Mensaje:   " + (data.mensaje  || "") + "\n" +
      "Fecha:     " + (data.fecha    || "") + "\n";

    MailApp.sendEmail({
      to: CORREO_DESTINO,
      subject: "🟦 Nuevo lead: " + (data.nombre || "Cotización") + " — " + (data.producto || ""),
      body: cuerpo
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
