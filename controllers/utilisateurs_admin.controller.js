const express = require("express");
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const Validation = require("../../class/Validation");
const { Op } = require("sequelize");
const Corporates = require("../../models/admin/Corporates");
const Utilisateurs = require("../../models/admin/Utilisateurs");
const md5 = require("md5");
const Profil = require("../../models/admin/Profil");
const UtilisateurUpload = require("../../class/uploads/UtilisateurUpload");
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS");
const Utilisateur_roles = require("../../models/admin/Utilisateur_roles");
const Roles = require("../../models/admin/Roles");
const bcrypt = require("bcrypt");
const Profil_roles = require("../../models/admin/Profil_roles");
const Corp_corporates = require("../../models/admin/Corp_corporates");
const Activity_logs = require("../../models/admin/Activity_logs");
const ACTIVITY_LOGS_TYPES = require("../../constants/ACTIVITY_LOGS_TYPES");
const Activity_logs_types = require("../../models/admin/Activity_logs_types");
const moment = require('moment-timezone');


/**
 * Permet de creer un corporate
 * @date  10/07/2023
 * @param {express.Request} req
 * @param {express.Response} res
 * @author eloge257 <nirema.eloge@mdiabox.bi>
 */

const createUtilisateur = async (req, res) => {
  try {
    const { NOM, PRENOM, TELEPHONE, EMAIL, USERNAME, ID_PROFIL, roles, ID_CORP_CORPORATE } = req.body;
    const files = req.files || {};
    const { IMAGE } = files;

    const data = { ...req.body, ...req.files };

    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 250],
      },
      PRENOM: {
        required: true,
        length: [1, 250],
      },
      TELEPHONE: {
        required: true,
        length: [1, 250],
        number: true,
      },
      EMAIL: {
        email: true,
        required: true,
        alpha: true,
        length: [1, 250],
        unique: "utilisateurs,EMAIL",
      },
      USERNAME: {
        required: true,
        length: [1, 250],
      },

      ID_PROFIL: {
        required: true,
        length: [1, 250],
      },
      IMAGE: {
        required: true,
        image: 20000000
      }
    }, {
      NOM: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        alpha: req.__('utilisateurs_admin.controller.createUtilisateur.Nom_invalide'),
        length: req.__('utilisateurs_admin.controller.createUtilisateur.NomLenght'),

      },
      PRENOM: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        alpha: req.__('utilisateurs_admin.controller.createUtilisateur.prenomAlpha'),
        length: req.__('utilisateurs_admin.controller.createUtilisateur.prenomLenght'),
      },
      TELEPHONE: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        length: req.__('utilisateurs_admin.controller.createUtilisateur.telephoneLenght'),
        number: req.__('utilisateurs_admin.controller.createUtilisateur.telephoneNumber'),
      },
      EMAIL: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        alpha: req.__('utilisateurs_admin.controller.createUtilisateur.EmailAlpha'),
        length: req.__('utilisateurs_admin.controller.createUtilisateur.EmailLenght'),
        unique: req.__('utilisateurs_admin.controller.createUtilisateur.EmailUnique'),
      },
      USERNAME: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        alpha: 'Le nom  est invalide',
        length: 'le nom ne doit pas depasse max(250 carateres)',
      },
      ID_PROFIL: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),

      },
      PROFIL: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),

      },
      IMAGE: {
        required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        image: req.__('utilisateurs_admin.controller.createUtilisateur.Image'),
      }
    });
    await validation.run();
    const isValid = await validation.isValidate();
    if (!isValid) {
      const errors = await validation.getErrors();
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors,
      });
    }

    var IMAGE_USER;
    const userUpload = new UtilisateurUpload();

    if (IMAGE) {
      const {
        fileInfo: fileInfo_4,
        thumbInfo: thumbInfo_4,
      } = await userUpload.upload(IMAGE, false);
      IMAGE_USER = fileInfo_4;
    }

    const salt = await bcrypt.genSalt()
    const PASSWORD = await bcrypt.hash(TELEPHONE, salt)

    //trouver le nom et prenom de l'utilisateur connecte
    const findoneuser = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: req.userId
      }
    })


    const utilisateur = await Utilisateurs.create({
      NOM,
      PRENOM,
      TELEPHONE,
      EMAIL,
      IMAGE: IMAGE_USER ? `${req.protocol}://${req.get("host")}/${IMAGES_DESTINATIONS.Utilisateur
        }/${IMAGE_USER.fileName}`
        : null,
      USERNAME,
      PASSWORD: PASSWORD,
      ID_PROFIL,
      IS_ACTIF: 0,
      ID_CORP_CORPORATE: ID_CORP_CORPORATE ? ID_CORP_CORPORATE : null
    });



    await Activity_logs.create({
      ID_UTILISATEUR: req.userId,
      ID_ACTIVITY_TYPE: ACTIVITY_LOGS_TYPES.CREATE_USER,
      DESCRIPTION: `${findoneuser.NOM} ${findoneuser.PRENOM} à créer l'utilisateur ${NOM} ${PRENOM}`,
    })


    // const allrole = JSON.parse(roles)
    // const roleData = allrole.map(reponse => {
    //   return {
    //     ID_UTILISATEUR: utilisateur.ID_UTILISATEUR,
    //     ID_ROLE: reponse.ID_ROLE,
    //     CAN_READ: reponse.CAN_READ,
    //     CAN_WRITE: reponse.CAN_WRITE
    //   }
    // })

    // await Utilisateur_roles.bulkCreate(roleData)

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Utilisateur a ete cree avec succes",
      result: utilisateur,
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
 * @author eloge257 <nirema.eloge@mediabox.bi>
 */
const findAll = async (req, res) => {
  try {
    const { profile, rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      utilisateurs: {
        as: "utilisateurs",
        fields: {
          ID_UTILISATEUR: "ID_UTILISATEUR",
          NOM: "NOM",
          PRENOM: "PRENOM",
          TELEPHONE: "TELEPHONE",
          EMAIL: "EMAIL",
          IMAGE: "IMAGE",
          USERNAME: "USERNAME",
          ID_PROFIL: "ID_PROFIL",
          IS_ACTIF: "IS_ACTIF",
          DATE_INSERTION: "utilisateurs.DATE_INSERTION",
        },
      },
      profil: {
        as: "profil",
        fields: {
          ID_PROFIL: "ID_PROFIL",
          DESCRIPTION: "DESCRIPTION",
        },
      },
      // utilisateur_roles: {
      //   as: "utilisateur_roles",
      //   fields: {
      //     ID_PROFIL_ROLE: "ID_PROFIL_ROLE",
      //     CAN_READ: "CAN_READ",
      //     CAN_WRITE: "CAN_WRITE",
      //     ID_ROLE: "ID_ROLE",
      //     DATE_INSERTION: "DATE_INSERTION"
      //   }
      // },
      // roles: {
      //   as: "role",
      //   fields: {
      //     ID_ROLE: "ID_ROLE",
      //     ROLE: "ROLE",
      //   }
      // },
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
      // orderColumn = sortColumns.corporates.fields.ID_CORPORATE
      orderColumn = sortColumns.utilisateurs.fields.DATE_INSERTION;
      sortModel = {
        model: "utilisateurs",
        as: sortColumns.utilisateurs,
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
      "NOM",
      "PRENOM",
      "TELEPHONE",
      "EMAIL",
      "USERNAME",
      "ID_PROFIL",
      "DATE_INSERTION",
      "$profil.DESCRIPTION$"
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
    var profileinfo = {}
    if (profile) {
      profileinfo = { ID_PROFIL: profile }
    }

    const result = await Utilisateurs.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      where: {
        ...globalSearchWhereLike,
        ...profileinfo
      },
      include: [{
        model: Profil,
        as: "profil",
        attributes: ["ID_PROFIL", "DESCRIPTION"],
        required: false,
      },
      {
        model: Corp_corporates,
        as: "corporate",
        required: false,
        attributes: ['ID_CORP_CORPORATE', 'NOM']
      }
      ]
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des utilisateurs",
      result: {
        data: result.rows,
        totalRecords: result.count,
        // totalRecords: result.rows.length,
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
 * Permet de recuperer un utilisateur par Id
 * @date  17/07/2023
 * @param {express.Request} req
 * @param {express.Response} res
 * @author eloge257 <nirema.eloge@mdiabox.bi>
 */

const findUserById = async (req, res) => {
  try {
    const { ID_UTILISATEUR } = req.params;
    const utilisateur = await Utilisateurs.findOne({
      where: {
        ID_UTILISATEUR,
      },
      include: [{
        model: Profil,
        as: "profil",
        attributes: ["ID_PROFIL", "DESCRIPTION"],
        required: false,
      },
      {
        model: Corp_corporates,
        as: "corporate",
        required: false,
        attributes: ['ID_CORP_CORPORATE', 'NOM']
      },
      {
        model: Utilisateur_roles,
        as: "utilisateur_roles",
        required: false,
        attributes: ["ID_PROFIL_ROLE", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
        include: {
          model: Roles,
          as: "role",
          required: false,
          attributes: ["ID_ROLE", "ROLE"],
        },
      },
      ],
      order: [
        [{ model: Utilisateur_roles, as: "utilisateur_roles" }, "ID_ROLE", "ASC"]
      ]
    });
    if (utilisateur) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'utilisateur enseignant trouvee",
        result: utilisateur,
      });
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'utilisateur non trouve",
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

/**
 * Permet de recuperer un supprimer  un ou plusieurs corporate
 * @date  17/07/2023
 * @param {express.Request} req
 * @param {express.Response} res
 * @author eloge257 <nirema.eloge@mdiabox.bi>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body;
    const ID_UTILISATEUR = JSON.parse(ids);

    // Trouver le nom et prénom de l'utilisateur connecté
    const findoneuser = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: req.userId
      }
    });


    // Trouver le nom et prénom de l'utilisateur supprime
    const findondalete = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: ID_UTILISATEUR
      }
    });
    //creation des logs d'activites
    await Activity_logs.create({
      ID_UTILISATEUR: req.userId,
      ID_ACTIVITY_TYPE: ACTIVITY_LOGS_TYPES.DELETE_USER,
      DESCRIPTION: `${findoneuser.NOM} ${findoneuser.PRENOM} a supprimé l'utilisateur ${findondalete?.NOM} ${findondalete?.PRENOM}`,

    });

    // supprimer l'utilisateur
    await Utilisateurs.destroy({
      where: {
        ID_UTILISATEUR: {
          [Op.in]: ID_UTILISATEUR,
        },
      },
    });



    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Les elements ont ete supprimer avec success",
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
 * Permet la modification d'un utilisateur
 * @date  17/07/2023
 * @param {express.Request} req
 * @param {express.Response} res
 * @author eloge257 <nirema.eloge@mediabox.bi>
 */

const updateUser = async (req, res) => {
  try {
    const { ID_UTILISATEUR } = req.params;
    const { NOM, PRENOM, TELEPHONE, EMAIL, USERNAME, ID_PROFIL, roles, ID_CORP_CORPORATE } = req.body;
    // const data = { ...req.body };
    const files = req.files || {}
    const { IMAGE } = files

    const profilObject = await Utilisateurs.findByPk(ID_UTILISATEUR, {
      attributes: ["IMAGE", "ID_UTILISATEUR"]
    })

    const prObject = profilObject.toJSON()

    const data = { ...req.body, ...req.files }
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 250],
      },
      PRENOM: {
        required: true,
        length: [1, 250],
      },
      TELEPHONE: {
        required: true,
        length: [1, 250],
        number: true,
      },
      EMAIL: {
        required: true,
        length: [1, 250],
        email: true,
      },
      USERNAME: {
        required: true,
        length: [1, 250],
      },

      ID_PROFIL: {
        required: true,
        length: [1, 250],
      },
    },

      {
        NOM: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
          length: req.__('utilisateurs_admin.controller.createUtilisateur.NomLenght'),

        },
        PRENOM: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
          length: req.__('utilisateurs_admin.controller.createUtilisateur.prenomLenght'),
        },
        TELEPHONE: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
          length: req.__('utilisateurs_admin.controller.createUtilisateur.telephoneLenght'),
          number: req.__('utilisateurs_admin.controller.createUtilisateur.telephoneNumber'),
        },
        EMAIL: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
          email: req.__('utilisateurs_admin.controller.createUtilisateur.EmailTrue'),
          length: req.__('utilisateurs_admin.controller.createUtilisateur.EmailLenght'),

        },
        USERNAME: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
          length: req.__('utilisateurs_admin.controller.createUtilisateur.prenomLenght'),
        },
        ID_PROFIL: {
          required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),

        },
        // PROFIL: {
        //   required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),

        // },
        // IMAGE: {
        //   required: req.__('utilisateurs_admin.controller.createUtilisateur.required'),
        //   image: req.__('utilisateurs_admin.controller.createUtilisateur.Image'),
        // }
      }


    );
    await validation.run();
    const isValid = await validation.isValidate();
    if (!isValid) {
      const errors = await validation.getErrors();
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors,
      });
    }

    const userUpload = new UtilisateurUpload();

    var filename_4
    if (IMAGE) {
      const { fileInfo } = await userUpload.upload(IMAGE, false)
      filename_4 = `${req.protocol}://${req.get("host")}/${IMAGES_DESTINATIONS.Utilisateur}/${fileInfo.fileName}`

      // ${req.protocol}://${req.get("host")}/${
      //         IMAGES_DESTINATIONS.Utilisateur
      //       }/${IMAGE_USER.fileName}
    }


    // Trouver le nom et prénom de l'utilisateur connecté
    const findoneuser = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: req.userId
      }
    });


    const utilisateur = await Utilisateurs.update(
      {
        NOM,
        PRENOM,
        TELEPHONE,
        EMAIL,
        IMAGE: filename_4 ? filename_4 : profilObject.IMAGE,
        USERNAME,
        ID_PROFIL,
        ID_CORP_CORPORATE: ID_CORP_CORPORATE ? ID_CORP_CORPORATE : null
      },
      {
        where: {
          ID_UTILISATEUR: ID_UTILISATEUR,
        },
      }
    );

    // Trouver le nom et prénom de l'utilisateur modifié
    const findonupdate = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: ID_UTILISATEUR
      }
    });

    await Activity_logs.create({
      ID_UTILISATEUR: req.userId,
      ID_ACTIVITY_TYPE: ACTIVITY_LOGS_TYPES.UPDATE_USER,
      DESCRIPTION: `${findoneuser.NOM} ${findoneuser.PRENOM} a modifié l'utilisateur ${findonupdate.NOM} ${findonupdate.PRENOM}`,
    })

    // const allrole = JSON.parse(roles)
    // await Utilisateur_roles.destroy({
    //   where: { ID_UTILISATEUR: ID_UTILISATEUR }
    // })
    // const roleData = allrole.map(reponse => {
    //   return {
    //     ID_UTILISATEUR: ID_UTILISATEUR,
    //     ID_ROLE: reponse.ID_ROLE,
    //     CAN_READ: reponse.CAN_READ,
    //     CAN_WRITE: reponse.CAN_WRITE
    //   }
    // })

    // await Utilisateur_roles.bulkCreate(roleData)

    const informationUser = await Utilisateurs.findOne({
      where: { ID_UTILISATEUR: ID_UTILISATEUR },
      attributes: ['ID_UTILISATEUR', 'USERNAME', 'EMAIL', 'IMAGE', 'NOM', 'PRENOM'],
      include: [
        {
          model: Profil,
          as: "profil",
          attributes: ["ID_PROFIL", "DESCRIPTION"],
          required: true,
          include: [
            {
              model: Profil_roles,
              attributes: ["ID_ROLE", "CAN_READ", "CAN_WRITE"],
              as: "profil_roles",
              required: false,
            }
          ]
        }]

    })
    const informationUser_json = informationUser.toJSON()
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'Action est faite avec succes",
      result: {
        utilisateur,
        informationUser_json
      }
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
 * Permet  de  mettre a jour le statut d'un utilisateur
 * @param {express.Request} req
 * @param {express.Response} res
 * @author Nirema eloge <nirema.eloge@mediabox.bi>
 */
const change_status = async (req, res) => {
  try {
    const { ID_UTILISATEUR } = req.params;

    // Trouver le nom et prénom de l'utilisateur connecté
    const findoneuser = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: req.userId
      }
    });

    // Trouver le nom et prénom de l'utilisateur active ou desactive
    const findonupdate = await Utilisateurs.findOne({
      attributes: ["NOM", "PRENOM"],
      where: {
        ID_UTILISATEUR: ID_UTILISATEUR
      }
    });


    const UtiObject = await Utilisateurs.findByPk(ID_UTILISATEUR, {
      attributes: ["ID_UTILISATEUR", "IS_ACTIF"],
    });
    const user = UtiObject.toJSON();
    let IS_ACTIF = 1;
    if (user.IS_ACTIF) {
      IS_ACTIF = 0;
      await Activity_logs.create({
        ID_UTILISATEUR: req.userId,
        ID_ACTIVITY_TYPE: ACTIVITY_LOGS_TYPES.DISABLE_USER,
        DESCRIPTION: `${findoneuser.NOM} ${findoneuser.PRENOM} a désactivé l'utilisateur ${findonupdate.NOM} ${findonupdate.PRENOM}`,
      })
    } else {
      IS_ACTIF = 1;
      await Activity_logs.create({
        ID_UTILISATEUR: req.userId,
        ID_ACTIVITY_TYPE: ACTIVITY_LOGS_TYPES.ENABLE_USER,
        DESCRIPTION: `${findoneuser.NOM} ${findoneuser.PRENOM} a activé l'utilisateur ${findonupdate.NOM} ${findonupdate.PRENOM}`,
      })
    }

    await Utilisateurs.update(
      { IS_ACTIF: IS_ACTIF },
      {
        where: { ID_UTILISATEUR: ID_UTILISATEUR },
      }
    );
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "succès",
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
 * Permet de modifier le mot de passe
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author ELOGE<nirema.eloge@mediabox.bi>
 * @date 2201/2024
 */
const changePWD = async (req, res) => {
  try {

    // const { USERS_ID } = req.params;
    const { oldPwd, newPwd, confirmPwd } = req.body;
    const validation = new Validation(
      req.body,
      {
        oldPwd:
        {
          length: [4, 16],
          required: true,
        },
        newPwd:
        {
          length: [4, 16],
          required: true,
        },
        confirmPwd:
        {
          length: [4, 16],
          required: true,
        },
      },
      {
        oldPwd:
        {
          required: "Le mot de passe est obligatoire",
        },
        newPwd:
        {
          required: "Le mot de passe est obligatoire",
        },
        confirmPwd:
        {
          required: "Le mot de passe est obligatoire",
        },

      }
    );
    await validation.run();
    const isValid = await validation.isValidate()
    const errors = await validation.getErrors()
    if (!isValid) {
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors
      })
    }
    const userObject = await Utilisateurs.findOne({
      where: { ID_UTILISATEUR: req.userId },
      attributes: ['ID_UTILISATEUR', 'PASSWORD', 'EMAIL'],
    })
    const user = userObject.toJSON()
    const validPassword = await bcrypt.compare(oldPwd, user.PASSWORD)
    if (validPassword) {
      if (newPwd == confirmPwd) {
        const salt = await bcrypt.genSalt()
        const PASSWORD = await bcrypt.hash(newPwd, salt)
        await Utilisateurs.update(
          {
            PASSWORD
          },
          {
            where: {
              ID_UTILISATEUR: req.userId
            },
          }
        );

        res.status(RESPONSE_CODES.CREATED).json({
          statusCode: RESPONSE_CODES.CREATED,
          httpStatus: RESPONSE_STATUS.CREATED,
          message: "Vous êtes connecté avec succès",
          result: {
            user
          }
        })

      } else {

        validation.setError('main', 'Deux mot de passe ne sont pas identiques')
        const errors = await validation.getErrors()
        res.status(RESPONSE_CODES.BADREQUEST).json({
          statusCode: RESPONSE_CODES.BADREQUEST,
          httpStatus: RESPONSE_STATUS.BADREQUEST,
          message: "Deux mot de passe ne sont pas identiques",
          result: errors
        })

      }
    } else {
      validation.setError('main', 'Ancien Mot de passe incorrect')
      const errors = await validation.getErrors()
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Ancien Mot de passe incorrect",
        result: errors
      })
    }

  } catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    })
  }
}

/**
 * Permet de recuperer les droits de l'utilisateur
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Jospin BA<jospin@mediabox.bi>
 * @date 13/02/2024
 */
const findAllRoleByIdUtil = async (req, res) => {
  try {
    const { ID_UTILISATEUR } = req.params
    const role_user = await Utilisateur_roles.findAll({
      attributes: ["ID_UTILISATEUR", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
      order: [["ID_ROLE", "ASC"]],
      where: {
        ID_UTILISATEUR,
      },
      include: [
        {
          model: Roles,
          as: "role",
          required: false,
          attributes: ["ID_ROLE", "ROLE"],
        },
      ],
    });
    if (role_user) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Utilisateur trouve",
        result: role_user,
      });
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Utilisateur non trouve",
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

/**
 * Permet de faire  la liste des activity logs
 * @date  26/04/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Jospin BA <jospin@mediabox.bi>
 */
const findAllActivityLogs = async (req, res) => {
  try {
    const {dateDebut,dateFin, typeactivities, auteur, rows = 10, first = 0, sortField, sortOrder, search } = req.query
    //   return console.log(ID_COURSE);
    const defaultSortField = "ID_LOG"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      activity_logs: {
        as: "activity_logs",
        fields: {
          ID_LOG: "ID_LOG",
          DESCRIPTION: "DESCRIPTION",
          DATE_INSERTION: "activity_logs.DATE_INSERTION"
        }

      },
      utilisateurs: {
        as: "utilisateurs",
        fields: {
          ID_UTILISATEUR: "ID_UTILISATEUR",
          NOM: "utilisateurs.NOM",
        }
      },
      activity_type: {
        as: "activity_type",
        fields: {
          ID_ACTIVITY_TYPE: "ID_ACTIVITY_TYPE",
          NOM_TYPE: "activity_type.NOM"
        }
      }
    }
    var orderColumn, orderDirection
    // sorting
    var sortModel
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as
          }
          orderColumn = sortColumns[key].fields[sortField]
          break
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.activity_logs.fields.ID_LOG
      sortModel = {
        model: 'activity_logs',
        as: sortColumns.activity_logs
      }
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = 'ASC'
    } else if (sortOrder == -1) {
      orderDirection = 'DESC'
    } else {
      orderDirection = defaultSortDirection
    }
  
    // searching
    const globalSearchColumns = [
      "DESCRIPTION",
      "DATE_INSERTION",
      "$utilisateurs.NOM$",
      "$utilisateurs.PRENOM$",
      "$utilisateurs.TELEPHONE$",
      "$activity_type.NOM$"
    ]
    var globalSearchWhereLike = {}
    if (search && search.trim() != "") {
      const searchWildCard = {}
      globalSearchColumns.forEach(column => {
        searchWildCard[column] = {
          [Op.substring]: search
        }
      })
      globalSearchWhereLike = {
        [Op.or]: searchWildCard
      }
    }

    var utilisateurinfo = {}
    var typeactivitiesinfo = {}

    if (auteur) {
      utilisateurinfo = { ID_UTILISATEUR:auteur }
    }

    if (typeactivities) {
      typeactivitiesinfo = {ID_ACTIVITY_TYPE: typeactivities  }
    }


    var dateWhere={}

    if (dateDebut) {
        const startDateFormat = moment.tz(dateDebut, req.headers.timezone || DEFAULT_TIMEZONE).set("hours", 0).set("minutes", 0).utc().format("YYYY-MM-DD HH:mm:ss")
        const endDateFormat = dateFin ?
            moment.tz(dateFin, req.headers.timezone || DEFAULT_TIMEZONE).set("hours", 23).set("minutes", 59).utc().format("YYYY-MM-DD HH:mm:ss") :
            moment.tz(new Date(), req.headers.timezone || DEFAULT_TIMEZONE).set("hours", 23).set("minutes", 59).utc().format("YYYY-MM-DD HH:mm:ss")
        dateWhere = {
          DATE_INSERTION: {
                [Op.between]: [startDateFormat, endDateFormat]
            }
        }
    }
   

    const result = await Activity_logs.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
        ...utilisateurinfo,
        ...typeactivitiesinfo,
        ...dateWhere
      },
      include: [
        {
          model: Activity_logs_types,
          as: "activity_type",
          required: true,
          attributes: ["ID_ACTIVITY_TYPE", "NOM"]
        },
        {
          model: Utilisateurs,
          as: "utilisateurs",
          required: true,
          attributes: ['ID_UTILISATEUR', 'NOM', 'PRENOM', 'IMAGE', 'TELEPHONE']
        },
      ]
    })
    const data = result.rows?.map(rowObject => {
      const row = rowObject.toJSON()
      return {
        ...row,
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des  activity logs",
      result: {
        data,
        totalRecords: result.count
      }
    })
  } catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard"
    })
  }
};





/**
 * Permet de faire  la liste des types d'activites
 * @date  02/05/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author leonard <leonard@mediabox.bi>
 */
const findTypesactivities = async (req, res) => {
  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "ID_ACTIVITY_TYPE"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      activity_logs_types: {
        as: "activity_logs_types",
        fields: {
          ID_ACTIVITY_TYPE: "ID_ACTIVITY_TYPE",
          NOM: "NOM"
        }

      },

    }
    var orderColumn, orderDirection
    // sorting
    var sortModel
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as
          }
          orderColumn = sortColumns[key].fields[sortField]
          break
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.activity_logs_types.fields.ID_ACTIVITY_TYPE
      sortModel = {
        model: 'activity_logs_types',
        as: sortColumns.activity_logs
      }
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = 'ASC'
    } else if (sortOrder == -1) {
      orderDirection = 'DESC'
    } else {
      orderDirection = defaultSortDirection
    }

    // searching
    const globalSearchColumns = [
      "NOM",
    ]
    var globalSearchWhereLike = {}
    if (search && search.trim() != "") {
      const searchWildCard = {}
      globalSearchColumns.forEach(column => {
        searchWildCard[column] = {
          [Op.substring]: search
        }
      })
      globalSearchWhereLike = {
        [Op.or]: searchWildCard
      }
    }

    const result = await Activity_logs_types.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },

    })
    const data = result.rows?.map(rowObject => {
      const row = rowObject.toJSON()
      return {
        ...row,
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des types activity logs",
      result: {
        data,
        totalRecords: result.count
      }
    })
  } catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard"
    })
  }
};


module.exports = {
  createUtilisateur,
  findAll,
  deleteItems,
  findUserById,
  updateUser,
  change_status,
  changePWD,
  findAllRoleByIdUtil,
  findAllActivityLogs,
  findTypesactivities
};
