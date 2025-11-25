const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const Company = require("../../models/settings/Company");
const Mot_cle = require("../../models/settings/Mot_cle");
const Pays = require("../../models/settings/Pays");
const yup = require("yup")

/**
 * @function pour inserter companies
 * @author <<Eloge257>>
 */

const createCompany = async(req,res) => {
    try {
        const { nom_societe,nif,adresse,ville,site_web,email_professionnel,id_motCle,phone1,phone2,idpays } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom_societe: yup.string().required("Nom de la societe  est obligatoire"),
            nif: yup.string().required("NIF est obligatoire"),
            adresse: yup.string().required("Adresse  est obligatoire"),
            ville: yup.string().required("Ville est obligatoire"),
            phone1: yup.string().required("Numero de telephone est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Company.create({
           nom_societe,nif,adresse,ville,site_web,email_professionnel,id_motCle,phone1,phone2,idpays
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Creation d societe  est faite avec succes",
            result:insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode:RESPONSE_CODES.UNPROCESSABLE_ENTITY,
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
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}

/**
 * @function pour afficher les societes
 * @author <<Eloge257>>
 */

const findAllCompany = async(req,res) => {
    try {
        const  ListeData = await Company.findAll({
            include: [
                { model: Pays, as: 'pays', attributes: ['id_pays', 'CommonName'] },
                { model: Mot_cle, as: 'mot_cle', attributes: ['id_mot_cle', 'motCle_name'] }
            ]
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:"Listes des societes",
            result:ListeData
        })

    } catch (error) {
        //capture des erreurs
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}
/**
 * @function pour return l info du pays
 * @param {id} id du pays
 * @author <<Eloge257>>
 */

const findCompanyById = async(req,res) => {
    try {

        const {id} = req.params
        const cmp = await Company.findOne({
            where:{
                id_company  : id
            }
        })
        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:`Informations du societe, ${cmp.nom_societe}`,
            result:cmp
        })

        
    } catch (error) {
             //capture des erreurs
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}

/**
 * @function pour modifier le pays
 * @author <<Eloge257>>
 */

const updatePays = async(req,res) => {
    try {
        const {id} = req.params
        const { nom_societe,nif,adresse,ville,site_web,email_professionnel,id_motCle,phone1,phone2,idpays } = req.body


        // verification que le pays existe
        const findCompanyById = await Company.findOne({
            where:{id_company:id}
        })
        //reposne une fois si l elemtn n est pas trouve
        if (!findCompanyById) {
        return res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus:RESPONSE_STATUS.NOT_FOUND,
                    message:"Societe non trouve"
                })
        }
        
            
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom_societe: yup.string().required("Nom de la societe  est obligatoire"),
            nif: yup.string().required("NIF est obligatoire"),
            adresse: yup.string().required("Adresse  est obligatoire"),
            ville: yup.string().required("Ville est obligatoire"),
            phone1: yup.string().required("Numero de telephone est obligatoire"),
        });
        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});


        //insertion des donnees
        const  updateData = await Company.update({
           nom_societe,nif,adresse,ville,site_web,email_professionnel,id_motCle,phone1,phone2,idpays
        },{
          where:{ id_company:id }
        })
        

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Modification de pays est faite avec succes",
            result:updateData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode:RESPONSE_CODES.UNPROCESSABLE_ENTITY,
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
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}



// exports les fonctions
module.exports = {
    createCompany,
    findAllCompany,
    findCompanyById,
    updatePays
}