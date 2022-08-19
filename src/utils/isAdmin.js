export const isAuthorized = (req,res,next) =>{
    const{isAdmin} = req.body;
    if(!isAdmin){
        const unAuthorized = {
            error:-1,
            description:`${req.url} ${req.method} No autorizado`
        }
        res.status(401).json(unAuthorized);
    }else{
        return next();
    }
}