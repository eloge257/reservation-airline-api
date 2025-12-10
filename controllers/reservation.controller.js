const RESPONSE_CODES = require("../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS");
const Client = require("../models/Client");
const yup = require("yup");
const Type_vol = require("../models/Type_vol");
const Vol = require("../models/Vol");
const Reservations = require("../models/Reservations");
const Airports = require("../models/Airports");
const Utilisateurs = require("../models/Utilisateurs");
const bcrypt = require("bcrypt");
const Historique_reservations = require("../models/Historique_reservations");
/**
 * @function pour inserter les clients
 * @author <<Eloge257>>
 */


const createClient = async (req, res) => {
    try {
        const { nom, prenom,telephone, email,username } = req.body
        // const telephone = "76897678"
        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            nom: yup.string().required("Champ est obligatoire"),
            prenom: yup.string().required("Champ est obligatoire"),
            email: yup.string().required("Champ obligatoire"),
            telephone: yup.string().required("Champ est obligatoire"),
            username:yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        //insertion des donnees
        const insertData = await Client.create({ nom, prenom, email, telephone })

        // inserter l ID dans la table utilisateurs 
        if (insertData) {
            const default_password = telephone.toString();
            const salt = await bcrypt.genSalt();
            const generated_password = await bcrypt.hash(default_password, salt);
            
            const insertUser = await Utilisateurs.create({
                id_client: insertData.id_client,
                username:username,
                mot_de_passe:generated_password,
                type_utilisateur:2,
                is_activated:1
             })
        }
     

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Action  est faite avec succes",
            result: insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
        //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}



// ------------------------------------- TYPE VOL
/**
 * @function pour inserter les types de vol
 * @author <<Eloge257>>
 */


const createTypeVol = async (req, res) => {
    try {
        const { nom_type, description } = req.body

        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            nom_type: yup.string().required("Champ est obligatoire"),
            description: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        //insertion des donnees
        const insertData = await Type_vol.create({ nom_type, description })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Action  est faite avec succes",
            result: insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
        //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}



// -------------------------------------  VOL
/**
 * @function pour inserter les vol
 * @author <<Eloge257>>
 */


const createVol = async (req, res) => {
    try {
        const { numero_vol, id_type_vol, airport_depart, airport_arrive,destination, date_depart, date_arrive, prix, compagnie } = req.body

        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            numero_vol: yup.string().required("Champ est obligatoire"),
            id_type_vol: yup.string().required("Champ est obligatoire"),
            airport_depart: yup.string().required("Champ est obligatoire"),
            airport_arrive: yup.string().required("Champ est obligatoire"),
            date_depart: yup.string().required("Champ est obligatoire"),
            date_arrive: yup.string().required("Champ est obligatoire"),
            prix: yup.string().required("Champ est obligatoire"),
            compagnie: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        //insertion des donnees
        const insertData = await Vol.create({ numero_vol, id_type_vol, destination,airport_depart, airport_arrive, date_depart, date_arrive, prix, compagnie })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Action  est faite avec succes",
            result: insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
        //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// -------------------------------------  Reservations
/**
 * @function pour inserter les reservations
 * @author <<Eloge257>>
 */


const createReservations = async (req, res) => {
    try {
        const { id_client, id_vol } = req.body

        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            id_client: yup.string().required("Champ est obligatoire"),
            id_vol: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        //insertion des donnees
        const insertData = await Reservations.create({ id_client, id_vol })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Action  est faite avec succes",
            result: insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
        //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// -------------------------------------  Airoport
/**
 * @function pour inserter les Airoports
 * @author <<Eloge257>>
 */


const createAirport = async (req, res) => {
    try {
        const { code,nom,ville,pays} = req.body

        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            code: yup.string().required("Champ est obligatoire"),
            nom: yup.string().required("Champ est obligatoire"),
            ville: yup.string().required("Champ est obligatoire"),
            pays: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        //insertion des donnees
        const insertData = await Airports.create({ code,nom,ville,pays })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Action  est faite avec succes",
            result: insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
        //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// -------------------------------------  All 
/**
 * @function pour lister tous les donnees
 * @author <<Eloge257>>
 */

const findAll = async (req,res) => {
    try {
        const  allReservation = await Reservations.findAll({
            include:[
                {
                    model:Client,
                    as:"client"
                },
                {
                    model:Vol,
                    as:"vol",
                    include:[
                        {
                            model:Type_vol,
                            as:"type_vol"
                        },
                        {
                            model:Airports,
                            as:"airport_dp"
                        },
                         {
                            model:Airports,
                            as:"airport_arr"
                        }
                    ]
                }
            ]
        })
        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Listes des reservations",
            result: allReservation
        })
        
    } catch (error) {
        console.log(error);
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// -------------------------------------  Change Statut 
/**
 * @function pour changer le statut  reservation
 * @author <<Eloge257>>
 */

const changeStatut = async (req,res) => {
    try {
        const {id_reservations} = req.params;
        const {statut_reservations} = req.body;
        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            statut_reservations: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        const reservation = await Reservations.findByPk(id_reservations);
        if(!reservation){
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Reservation non trouvé",
            })
        }
        reservation.statut_reservations = statut_reservations;
        await reservation.save();
        // creation de l historique de modification de statut
            await Historique_reservations.create({
                id_reservations:id_reservations,
                statut:statut_reservations
            })
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Statut mis à jour avec succès",
            result: reservation
        })
    } catch (error) {
         // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
          console.log(error);
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

/**
 * @function pour changer le statut  Vol
 * @author <<Eloge257>>
 */

const changeStatutVol = async (req,res) => {
    try {
        const {id_vol} = req.params;
        const {status_vol} = req.body;
        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            status_vol: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        const vol_data = await Vol.findByPk(id_vol);
        if(!vol_data){
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Vol non trouvé",
            })
        }
        vol_data.status_vol = status_vol;
        await vol_data.save();
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Statut mis à jour avec succès",
            result: vol_data
        })
    } catch (error) {
         // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
          console.log(error);
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

/**
 * @function pour desactiver ou activer un client
 * @author <<Eloge257>>
 */

const activ_desactiv_client = async (req,res) => {
    try {
        const {id_client} = req.params;
        const {is_activated} = req.body;
        //validation des champs avant l'enregistrement
        const validationSchema = yup.object({
            is_activated: yup.string().required("Champ est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        const client_data = await Client.findByPk(id_client);
        if(!client_data){
            return res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Client non trouvé",
            })
        }
        client_data.is_activated = is_activated;
        await client_data.save();
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Statut mis à jour avec succès",
            result: client_data
        })
    } catch (error) {
         // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
          console.log(error);
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// --------------------------------Listes
/**
 * Lister tous les utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findAllclient = async (req, res) => {
  try {
    const {  rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      client: {
        as: "client",
        fields: {
          id_client: "id_client",
        },
      },
    };

    var orderColumn, orderDirection;

    // sorting
    var sortModel;
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.client.fields.id_client;
      sortModel = {
        model: "client",
        as: sortColumns.client,
      };
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = "ASC";
    } else if (sortOrder == -1) {
      orderDirection = "DESC";
    } else {
      orderDirection = defaultSortDirection;
    }

    // searching
    const globalSearchColumns = [
      "nom",
      "prenom",
    ];
    var globalSearchWhereLike = {};
    if (search && search.trim() != "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }
   

    const result = await Client.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      where: {
        ...globalSearchWhereLike,
      },
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des client",
      result: {
        data: result.rows,
        totalRecords: result.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};



// --------------------------------Listes
/**
 * Lister tous les utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findAllReservation = async (req, res) => {
  try {
    const {  rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      reservations: {
        as: "reservations",
        fields : {
          id_reservations : "id_reservations",
        },
      },
    };

    var orderColumn, orderDirection;

    // sorting
    var sortModel;
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.reservations.fields.id_reservations;
      sortModel = {
        model: "reservations",
        as: sortColumns.reservations,
      };
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = "ASC";
    } else if (sortOrder == -1) {
      orderDirection = "DESC";
    } else {
      orderDirection = defaultSortDirection;
    }

    // searching
    const globalSearchColumns = [
      "id_client",
    ];
    var globalSearchWhereLike = {};
    if (search && search.trim() != "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }
  

    const result = await Reservations.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
        include:[
                {
                    model:Client,
                    as:"client"
                },
                {
                    model:Vol,
                    as:"vol",
                    include:[
                        {
                            model:Type_vol,
                            as:"type_vol"
                        },
                        {
                            model:Airports,
                            as:"airport_dp"
                        },
                         {
                            model:Airports,
                            as:"airport_arr"
                        }
                    ]
                }
            ],
      where: {
        ...globalSearchWhereLike,
      },
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des client",
      result: {
        data: result.rows,
        totalRecords: result.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};


/**
 * Lister tous les utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findAllVol = async (req, res) => {
  try {
    const {  rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      vol: {
        as: "vol",
        fields : {
          id_vol : "id_vol",
        },
      },
    };

    var orderColumn, orderDirection;

    // sorting
    var sortModel;
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.vol.fields.id_vol;
      sortModel = {
        model: "vol",
        as: sortColumns.vol,
      };
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = "ASC";
    } else if (sortOrder == -1) {
      orderDirection = "DESC";
    } else {
      orderDirection = defaultSortDirection;
    }

    // searching
    const globalSearchColumns = [
      "id_vol",
    ];
    var globalSearchWhereLike = {};
    if (search && search.trim() != "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }
  

    const result = await Vol.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      include:[
                        {
                            model:Type_vol,
                            as:"type_vol"
                        },
                        {
                            model:Airports,
                            as:"airport_dp"
                        },
                         {
                            model:Airports,
                            as:"airport_arr"
                        }
                    ],
      where: {
        ...globalSearchWhereLike,
      },
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des client",
      result: {
        data: result.rows,
        totalRecords: result.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};


/**
 * Lister tous les utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findAllairports = async (req, res) => {
  try {
    const {  rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      airports: {
        as: "airports",
        fields: {
          id_airports: "id_airports",
        },
      },
    };

    var orderColumn, orderDirection;

    // sorting
    var sortModel;
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.airports.fields.id_airports
      sortModel = {
        model: "airports",
        as: sortColumns.airports,
      };
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = "ASC";
    } else if (sortOrder == -1) {
      orderDirection = "DESC";
    } else {
      orderDirection = defaultSortDirection;
    }

    // searching
    const globalSearchColumns = [
      "id_airports",
    ];
    var globalSearchWhereLike = {};
    if (search && search.trim() != "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }
  

    const result = await Airports.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      where: {
        ...globalSearchWhereLike,
      },
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des client",
      result: {
        data: result.rows,
        totalRecords: result.count,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};






module.exports = {
    createAirport,
    createClient,
    createReservations,
    createTypeVol,
    createVol,
    findAll,
    changeStatut,
    changeStatutVol,
    activ_desactiv_client,
    findAllclient,
    findAllReservation,
    findAllVol,
    findAllairports
}




