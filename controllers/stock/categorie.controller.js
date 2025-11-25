const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const Categorie = require("../../models/stock/Categorie");
const yup = require("yup")

/**
 * @function pour inserter les categories
 * @author <<Eloge257>>
 */


const createCategorie = async(req,res) => {
    try {
        const { nom,description} = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom: yup.string().required("Nom de la categorie  est obligatoire"),
            description: yup.string().required("Description est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Categorie.create({  nom,description })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Creation du categorie  est faite avec succes",
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
 * @function pour lister les categories
 * @author <<Eloge257>>
 */

const findAllCategorie = async(req,res) => {
    try {
        const data = await Categorie.findAll()
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des categories",
            result:data
        })
    } catch (error) {
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}

/**
 * @function pour modifer les categories
 * @author <<Eloge257>>
 */


const updateCategorie = async(req,res) => {
    try {
        const { nom,description } = req.body
        const { id } = req.params
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            nom: yup.string().required("Nom de la categorie  est obligatoire"),
            description: yup.string().required("Description est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  updateData = await Categorie.update({  nom,description }, {
            where:{ id_categorie: id}
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Modification du categorie  est faite avec succes",
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


/**
 * @function pour supprimer  categorie
 * @author <<Eloge257>>
 */

const deleteCategorie =async(req,res) => {
    try {
        const { id} = req.params
        const data = await Categorie.destroy({
            where:{ id_categorie: id}
        })
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Suppression faite avec succes",
            result:data
        })
    } catch (error) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}


module.exports = {
    createCategorie,
    findAllCategorie,
    updateCategorie,
    deleteCategorie
}