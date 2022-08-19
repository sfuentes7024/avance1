const fs = require('fs');

class Container {
	
	constructor(fileName){

	this.fileName = fileName;
	}

    async save(product){
        try {
            const products = await this.getAll();
            let nextId;
            if(!products.length){
                nextId = 1;
            }else{
                const lastProduct = products.slice(-1)[0];
                let lastProductId = lastProduct.id;
                nextId = lastProductId + 1; 
            }
            product['id'] = nextId;
            product['price'] = parseInt(product['price']);
            products.push(product);
            console.log(product);
            const writeFile = await fs.promises.writeFile(this.fileName, JSON.stringify(products));
            return product;
        } catch (error) {
            console.log(error);
              return "No se pudo agregar el producto al archivo";
        }
    }

	async getById(id){

		try{
			const products = await fs.promises.readFile(this.fileName, 'utf-8');
			const productsParse = JSON.parse(products);
			let product = productsParse.find(item => item.id === id);
			return product;

		} catch(error) {
			return "Error loading products list";
		}
	}

	async getAll(){

		try{
			const products = await fs.promises.readFile(this.fileName, 'utf-8');
			console.log(products);
			const productsParse = JSON.parse(products);
			console.log(productsParse);
			return productsParse;

		}catch(error){
			console.log(error);
			return "Products list don't charge";
		}
    }

	async deleteById(id){
		try {
			const product = await this.getById(id);
			const products = await this.getAll();
			const contentEdited = products.filter(item => item.id != product.id);
			const deleteById = await fs.promises.writeFile(this.fileName, JSON.stringify(contentEdited));
			return `Product with id ${id} deleted succesfully`;

		} catch(error) {
            console.log(error);
			return `Product with id ${id} couldn't be deleted`;
		}
	}

	async deleteAll(){

		try {
			const deleteAll = await fs.promises.writeFile(this.fileName,"[]");
			return "All products deleted succesfully";

		} catch(error){
			return "Products couldn't be deleted";
		}
	}

    async updateById(id, product){
        try {
            const productsList = await this.getAll();
            const productIndex = productsList.findIndex(item => item.id == id);
            if(productIndex >= 0){
                product['id'] = parseInt(id);
                productsList.splice(productIndex,1, product);
                const updateById = await fs.promises.writeFile(this.fileName, JSON.stringify(productsList));
                return product; 
            }else{
                return "Product couldn't be found";
            }
        } catch (error) {
            return "Can't upload product";
        }
    }
}

module.exports = Container;