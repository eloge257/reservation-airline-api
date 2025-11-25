const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const Pays = require("../../models/settings/Pays");
const yup = require("yup")

/**
 * @function pour inserter les pays
 * @author <<Eloge257>>
 */

const createPays = async(req,res) => {
    try {
        const { CommonName,Capital } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            CommonName: yup.string().required("Nom du pays  est obligatoire"),
            Capital: yup.string().required("Capital est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Pays.create({
            CommonName,
            Capital
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Creation de pays est faite avec succes",
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
 * @function pour afficher les pays
 * @author <<Eloge257>>
 */

const findAllPays = async(req,res) => {
    try {
        const  ListeData = await Pays.findAll()

        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:"Listes des pays",
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

const findPays = async(req,res) => {
    try {

        const {id} = req.params
        const pays = await Pays.findOne({
            where:{
                id_pays : id
            }
        })
        //reponse  d une fonction
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK ,
            message:`Informations sur le pays, ${pays.CommonName}`,
            result:pays
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
        const { CommonName,Capital } = req.body
        const {id} = req.params

        // verification que le pays existe
        const findPaysById = await Pays.findOne({
            where:{id_pays:id}
        })
        //reposne une fois si l elemtn n est pas trouve
        if (!findPaysById) {
        return res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus:RESPONSE_STATUS.NOT_FOUND,
                    message:"Pays no trouve"
                })
        }
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            CommonName: yup.string().required("Nom du pays  est obligatoire"),
            Capital: yup.string().required("Capital est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  updateData = await Pays.update({
            CommonName,
            Capital
        },{
          where:{ id_pays:id }
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
    createPays,
    findAllPays,
    findPays,
    updatePays
}