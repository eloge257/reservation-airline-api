
// fonction pour creer l'Ventes

const Produit = require("../../models/stock/Produit");

const createVentes = async (req, res) => {
  try {
    const { CLIENT_ID, TYPE_PAIEMENT, DEVISE,employe,quantiteTotal,TVATotal,PTTotal } = req.body;
    const price_currency = DEVISE;
    const payment_type = TYPE_PAIEMENT
    const customerId = CLIENT_ID

    const structuredData = Object.entries(req.body).reduce(
      (acc, [key, value]) => {
        // Extraire l'index numérique de la clé (par exemple, "PRODUIT_ID0" -> 0)
        const match = key.match(/(\d+)$/); // Trouve les chiffres à la fin de la clé
        if (match) {
          const index = match[1]; // Récupère l'index
          if (!acc[index]) {
            acc[index] = {}; // Initialise un nouvel objet pour cet index
          }
          // Ajoute la clé et la valeur à l'objet correspondant
          acc[index][key.replace(index, "")] = value; // Supprime l'index de la clé
        }
        return acc;
      },
      {}
    );

    const table_name = "products";
    const invoiceItems = await Promise.all(Object.values(structuredData).map(async (item) => {
      // Récupérer le nom du produit en fonction de l'ID_PRODUIT
      // const productInfo = await achats_model.findByIdNomPro(table_name, item.PRODUIT_ID);
    //   const TVA_pro = await vente_model.SelectTva(table_name, item.PRODUIT_ID);
     const TVA_pro = await Produit.findOne({
        where: { id_produit: item.PRODUIT_ID },
        attributes: ['taxe_rate']
      });
      const vat = (TVA_pro.vat_rate * item.PRIX) / 100;// ici je essayer de trouver la valeur du TVA pour chaque produi
      const item_price_nvat = item.QUANTITE * item.PRIX;// donc ici on devrai trouve le prix de vente hors TVA
      const item_price_wvat = item_price_nvat + vat;// et ici le prix de vente avec TVA
      const item_total_amount = item_price_nvat + vat;
      const procuctName_info = item.PRODUCT_NAME
      return {
        "item_designation": procuctName_info || `Produit ${item.PRODUIT_ID}`, // Nom du produit ou un fallback
        "item_quantity": parseInt(item.QUANTITE, 10),
        "item_price": parseFloat(item.PRIX),
        "item_ct": 0, // Exemple : Ajoutez une valeur par défaut
        "item_tl": 0, // Exemple : Ajoutez une valeur par défaut
        "item_price_nvat": parseFloat(item.PRIX_TOTAL) - parseFloat(item.TVA), // Prix hors TVA
        "vat": parseFloat(item.TVA),
        "item_price_wvat": item_price_wvat, // Prix avec TVA
        "item_total_amount": item_total_amount, // Total
      };
    })
    );

    const tablecompanies = "companies";
    const Company = await achats_model.Companyobr(tablecompanies);
    const tp_name = Company[0].name;

    const tp_type = Company[0].tp_type;
    const tp_TIN = Company[0].tp_TIN;
    const tp_trade_number = Company[0].tp_trade_number;
    const tp_postal_number = Company[0].tp_postal_number;
    const tp_phone_number = Company[0].tp_phone_number;
    const tp_address_province = Company[0].tp_address_province;
    const tp_address_commune = Company[0].tp_address_commune;
    const tp_address_quartier = Company[0].tp_address_quartier;
    const tp_address_avenue = Company[0].tp_address_avenue;
    const tp_address_rue = Company[0].tp_address_rue;
    const tp_address_number = Company[0].tp_address_number;
    const vat_taxpayer = Company[0].vat_taxpayer;
    const ct_taxpayer = Company[0].ct_taxpayer;
    const tl_taxpayer = Company[0].tl_taxpayer;
    const tp_fiscal_center = Company[0].tp_fiscal_center;
    const tp_activity_sector = Company[0].tp_activity_sector;
    const tp_legal_form = Company[0].tp_legal_form;
    const device_prefix = Company[0].device_prefix;
    const invoice_currency = price_currency;

    //return console.log(id_invoice)
    const COUNTe = await achats_model.COUNT_invoice();

    const yearnow = moment().format("YYYY");
    //dte_nowe
    const dte_nowe = moment().format("YYYY-MM-DD HH:mm:ss");
    const dte_qrcode = moment().format("YYYY-MM-DD");

    const invoice_number = COUNTe[0].id + 1 + "/" + yearnow;
    const sdevice = await achats_model.SelectCompanyobr_username(
      tablecompanies
    );
    const formattedDate = getCurrentDateTime();

    const invoicenumber = tp_TIN + "/" + sdevice[0].obr_username + "/" + formattedDate + "/" + invoice_number;
    const invoice_date = dte_nowe;
    const invoice_identifier = invoicenumber;
    const invoice_type = "FN";


    //return console.log(formattedDate)
    const table_unite = "units";
    const table_invoices = "invoices";
    const Client_obr = "customers";
    const customer = await achats_model.Client_obr(Client_obr);
    //
    const tkn = await client_ctrl.Login_obr_ebms();
    const customer_name = customer[0].customer_name;
    const customer_TIN = customer[0].customer_TIN;
    const customer_address = customer[0].customer_address;
    const vat_customer_payer = customer[0].vat_customer_payer;
    const cancelled_invoice_ref = "";
    const invoice_ref = "";
    const cn_motif = "";
    const objectData = {
      "invoice_number": invoice_number,
      "invoice_date": invoice_date,
      "invoice_type": "FN",
      "tp_type": tp_type,
      "tp_name": tp_name,
      "tp_TIN": tp_TIN,
      "tp_trade_number": tp_trade_number,
      "tp_postal_number": tp_postal_number,
      "tp_phone_number": tp_phone_number,
      "tp_address_province": tp_address_province,
      "tp_address_commune": tp_address_commune,
      "tp_address_quartier": tp_address_quartier,
      "tp_address_avenue": tp_address_avenue,
      "tp_address_number": tp_address_number,
      "vat_taxpayer": vat_taxpayer,
      "ct_taxpayer": ct_taxpayer,
      "tl_taxpayer": tl_taxpayer,
      "tp_fiscal_center": tp_fiscal_center,
      "tp_activity_sector": tp_activity_sector,
      "tp_legal_form": tp_legal_form,
      "payment_type": payment_type,
      "invoice_currency": invoice_currency,
      "customer_name": customer_name,
      "customer_TIN": customer_TIN,
      "customer_address": customer_address,
      "vat_customer_payer": vat_customer_payer,
      "cancelled_invoice_ref": cancelled_invoice_ref,
      "invoice_ref": invoice_ref,
      "cn_motif": cn_motif,
      "invoice_identifier": invoice_identifier,
      "invoice_items": invoiceItems

    }

    console.log(objectData, "------------------------");
    
    // return console.log(JSON.stringify(objectData));
     try {
      const rep = await axios.post(
        "https://ebms.obr.gov.bi:8443/ebms_api/addInvoice_confirm/",
        JSON.stringify(objectData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
        }
      );


      const employeeId = employe;
      const invoice_signature = rep.data.electronic_signature;
      const invoice_signature_date = rep.data.result.invoice_registered_date;
      const sync_status = 1;
      const cancelled_invoice = "";
     
         // Générer le QR code
    const qrCodeData = invoice_identifier; // Contenu du QR code
    const qrCodeFileName = `qrcode_${dte_qrcode}.png`; // Nom du fichier QR code
    const qrCodeFilePath = path.join(__dirname, "../public", qrCodeFileName); // Chemin complet du fichier

    await QRCode.toFile(qrCodeFilePath, qrCodeData, {
      width: 300, // Largeur du QR code
      margin: 2,  // Marge autour du QR code
    });

     const eoime = await vente_model.createObr_invoice(
        employeeId,
        customerId,
        invoice_number,
        invoice_date,
        payment_type,
        invoice_type,
        cancelled_invoice,
        cancelled_invoice_ref,
        invoice_signature,
        invoice_currency,
        invoice_signature_date,
        invoice_ref,
        cn_motif,
        invoice_identifier,
        sync_status
      );

      //   const {productId, quantity, price,price_currency,movement_type,payment_type,customerId, total} = req.body
      if (rep.data.success) {
        const discount_invoice = 0;
        const returne_invoice = 0;
        const payable = PTTotal+TVATotal
        //return console.log(payable_invoice)
      const insertId=  await vente_model.createInvoice(
          employeeId,
          customerId,
          PTTotal,
          TVATotal,
          discount_invoice,
          payable,
          payable,
          returne_invoice
        );

        await vente_model.saveQrCodePath(qrCodeFilePath, invoice_number,insertId.insertId);
  
      // return console.log(insertId.insertId);
      const system_or_device = await achats_model.SelectCompanyobr_username(
        tablecompanies
      );
      const system_or_device_id = system_or_device[0].obr_username;
      const item_ct =0
      const item_tl=0
      const item_ott_tax =0
      const item_tsce_tax =0

      for (const [index, data] of Object.entries(structuredData)) {
        const quantity = data.QUANTITE;
        const price = data.PRIX;
        const productId = data.PRODUIT_ID;
        const total = data.PRIX_TOTAL
      const procuctName_info = data.PRODUCT_NAME
        
        const item_cod = await achats_model.findByIdbarcode(
          table_name,
          productId
        );

        const item_code = item_cod[0].barcode;
        const item_designation = procuctName_info;
        const item_quantity = quantity;
        const item_measurement_unit = data.UNITE_NAME;
        const item_cost_price = price;
        const item_cost_price_currency = price_currency;
        const item_movement_type = "SN";
        const item_movement_invoice_ref = "";
        const item_movement_description = "";
        const item_movement_date = dte_nowe;

        const TVAProduit = await vente_model.SelectTva(table_name, data.PRODUIT_ID);
        const itemprixitems = (data.PRIX * TVAProduit[0].vat_rate)/100
        const itemprixitehtva = data.PRIX - itemprixitems // item price
        const itemprix_nvat=itemprixitehtva * data.QUANTITE // item price nvat
        const itm_vat=itemprixitems * data.QUANTITE // item vat
        const itm_wvat=itemprix_nvat + itm_vat  // item wvat


        // const vat = (TVAProduit[0].vat_rate * data.PRIX) / 100;// ici je essayer de trouver la valeur du TVA pour chaque produi
        // const item_price_nvat = item.QUANTITE * data.PRIX;// donc ici on devrai trouve le prix de vente hors TVA
        // const item_price_wvat = item_price_nvat + vat;// et ici le prix de vente avec TVA
        // const item_total_amount = item_price_nvat + vat;
        const currentQuantity = await achats_model.findByIdAchat(
          table_name,
          productId
        );
        //return console.log(currentQuantity)
        const newQuantity = currentQuantity[0].quantity - quantity;
        // return console.log(newQuantity)
        const data_mvrt_obr = {
          "system_or_device_id": system_or_device_id,
          "item_code": item_code,
          "item_designation": item_designation,
          "item_quantity": item_quantity,
          "item_measurement_unit": item_measurement_unit,
          "item_cost_price": item_cost_price,
          "item_cost_price_currency": item_cost_price_currency,
          "item_movement_type": item_movement_type,
          "item_movement_invoice_ref": item_movement_invoice_ref,
          "item_movement_description": item_movement_description,
          "item_movement_date": item_movement_date,
        };
        
        await vente_model.createSale(
          insertId.insertId,
          productId,
          quantity,
          price,
          total
        );
        //update produit
        await achats_model.UpdateProduit(newQuantity, productId);
        //invoice_sync
        const invoiceId = eoime.insertId;
        const http_cd = 200;
        const http_msge = "OK";
        const success = true;
        const server_msgh = rep.data.msg;
        const invoice_registered_number =
          rep.data.result.invoice_registered_number;
        const electronic_signature = rep.data.electronic_signature;
        await vente_model.createInvoie_ynchr(
          employeeId,
          insertId.insertId,
          http_cd,
          http_msge,
          success,
          server_msgh,
          invoice_number,
          invoice_registered_number,
          invoice_signature_date,
          electronic_signature
        );
        
       
        await vente_model.createItemObr(
          invoiceId,
          item_designation,
          item_quantity,
          itemprixitehtva,
          item_ct,
          item_tl,
          item_ott_tax,
          item_tsce_tax,
          itemprix_nvat,
          itm_vat,
          itm_wvat,
          itm_wvat,
          item_code

        );
        //invoice_obr
        const tokaale = await mouvement_model.createMouvementProduit(
          productId,
          system_or_device[0].obr_username,
          item_cod[0].barcode,
          procuctName_info,
          quantity,
          item_measurement_unit,
          price,
          price_currency,
          item_movement_type,
          "",
          "",
          dte_nowe,
          1
        );

        //return console.log(tokaale.insertId)
        const mvtId = tokaale.insertId;
        const http_code = 200;
        const http_msg = "OK";

        const server_msg = "Stock movement added successfully.";

        const roma = await axios.post(
          "https://ebms.obr.gov.bi:8443/ebms_api/AddStockMovement/",
          JSON.stringify(data_mvrt_obr), // This should be the data you want to send
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tkn}`,
            },
          }
        );
        // return console.log(roma.data,"------------------------")
        if (roma.data.success == true) {
          //obr_synchronisation_mouvement
          await achats_model.createCret(
            mvtId,
            http_code,
            http_msg,
            success,
            server_msg
          );
        } else {
          console.log('Erreur lors de l\'envoi de la facture :');
          res.status(400).json({
            success: false,
            message: "Erreur lors de l'envoi de la facture.",
            error: rep.data,
          });
        }

      } 
      res.status(200).json({
        success: true, 
        message: "Facture créée et envoyée avec succès.",
      });
    }else {
      // console.error("Erreur lors de l'envoi de la facture :", rep.data);
      res.status(400).json({
        success: false,
        message: "Erreur lors de l'envoi de la facture.",
        error: rep.data,
      });
    }
    } catch (error) {
   
      console.error(error.response.data.msg);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: error.response?.data?.msg
    });
    }


  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};