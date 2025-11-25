const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const Client = require("../../models/settings/client");
const Company = require("../../models/settings/Company");
const Mot_cle = require("../../models/settings/Mot_cle");
const Pays = require("../../models/settings/Pays");
const yup = require("yup")

/**
 * @function pour inserter les clients
 * @author <<Eloge257>>
 */

const createClient = async(req,res) => {
    try {
        const { nom_client,prenom_client,fonction,email,telephone1,telephone2,id_motCle,id_company,typeClient} = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom_client: yup.string().required("Nom du client  est obligatoire"),
            prenom_client: yup.string().required("Prenom du client est obligatoire"),
            fonction: yup.string().required("Fonction  est obligatoire"),
            telephone1: yup.string().required("Telephone est obligatoire"),
            typeClient: yup.string().required("Typedu client  est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Client.create({
           nom_client,prenom_client,fonction,email,telephone1,telephone2,id_motCle,id_company,typeClient
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Creation du client  est faite avec succes",
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
 * @function pour afficher les clients
 * @author <<Eloge257>>
 */

const findAllClient = async(req,res) => {
    try {
        const  ListeData = await Client.findAll({
            include: [
                { model: Company, as: 'company', attributes: ['id_company', 'nom_societe'] },
                { model: Mot_cle, as: 'mot_cle', attributes: ['id_mot_cle', 'motCle_name'] }
            ]
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:"Listes des clients",
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
 * @param {id}  du client
 * @author <<Eloge257>>
 */

const findClientById = async(req,res) => {
    try {

        const {id} = req.params
        const cl = await Client.findOne({
            where:{
                idClient : id
            }
        })
        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:`Informations du client, ${cl.nom_client}`,
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

const updateClient = async(req,res) => {
    try {
        const {id} = req.params

        const { nom_client,prenom_client,fonction,email,telephone1,telephone2,id_motCle,id_company,typeClient} = req.body
        
        // verification que le pays existe
        const findClientById = await Client.findOne({
            where:{idClient :id}
        })
        //reposne une fois si l elemtn n est pas trouve
        if (!findClientById) {
        return res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus:RESPONSE_STATUS.NOT_FOUND,
                    message:"Client non trouve"
                })
        }
        

        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom_client: yup.string().required("Nom du client  est obligatoire"),
            prenom_client: yup.string().required("Prenom du client est obligatoire"),
            fonction: yup.string().required("Fonction  est obligatoire"),
            telephone1: yup.string().required("Telephone est obligatoire"),
            typeClient: yup.string().required("Typedu client  est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Client.update({
           nom_client,prenom_client,fonction,email,telephone1,telephone2,id_motCle,id_company,typeClient
        },{
          where:{ idClient:id }
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
    createClient,
    findAllClient,
    findClientById,
    updateClient
}