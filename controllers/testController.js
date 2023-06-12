export const testPostController = (req,res) =>{
    console.log("hello")
    const {name} = req.body;
    res.send(`Your name is ${name}`);
}