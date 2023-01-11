import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    
    try {
        const id = req.params.id
        const result = accounts.find((account) => account.id === id) 

            if(!result){
                res.status(404)
                throw new Error("Conta não encontrada. Verifique a 'id'.")
            }
            res.status(200).send(result)
    } catch (error: any) {
        console.log(error)
        
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    
    try {
        const id = req.params.id    
        
        if(id[0] !== "a"){
            res.status(400)
            throw new Error("'id' inválido. Deve iniciar com letra 'a'.");            
        }
        
            const accountIndex = accounts.findIndex((account) => account.id === id)

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso.")
        } else {
            res.status(404).send("O item não foi encontrado no banco de dados.")

        }
    
    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
    

})

app.put("/accounts/:id", (req: Request, res: Response) => {

    // req.body.balance (newBalance)
    // Deve ser number
    // Deve ser maior ou igual a zero
    
    try {
        const { id } = req.params
        
        const newId = req.body.id
        const newOwnerName = req.body.ownerName
        const newBalance = req.body.balance
        const newType = req.body.type

        if(id[0] !== "a"){
            res.status(400)
            throw new Error("'id' inválido. Deve iniciar com letra 'a'.");
        }

        if(newId !== undefined){
            if(newId !== undefined){
                if(typeof newId !== "string"){
                    res.status(400)
                    throw new Error("'id' deve ser do tipo string.")
                }
                if(newId[0] !== "a"){
                    res.status(400)
                    throw new Error("'id' inválido. Deve iniciar com letra 'a'.");            
                }
            }
        }

        if(newOwnerName !== undefined){
            if(typeof newOwnerName !== "string"){
                res.status(400)
                throw new Error("'ownerName' deve ser do tipo string.")
            }
            if(newOwnerName.length < 2){
                res.status(400)
                throw new Error("'ownerName' inválido. Deve possuir no mínimo dois caracteres."); 
            }
        }

        if(newBalance !== undefined){
            if(typeof newBalance !== "number"){
                res.status(400)
                throw new Error("'balance' deve ser do tipo number.")
            }    
            if(newBalance < 0){
                res.status(400)
                throw new Error("'balance' não pode ser um número negativo.")
            }
        }
        

        if(newType !== undefined){
            if(
                newType !== ACCOUNT_TYPE.GOLD &&
                newType !== ACCOUNT_TYPE.PLATINUM &&
                newType !== ACCOUNT_TYPE.BLACK){
                    res.status(400)
                    throw new Error("'type' deve ter um tipo válido: Ouro, Platina ou Black." )
                }            
        }

        const account = accounts.find((account) => account.id === id) 
    
        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type
    
            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }
    
        res.status(200).send("Atualização realizada com sucesso")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})