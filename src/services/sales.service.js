const SalesModule = require('../models/sales.model');


const { isValidObjectId } = require('mongoose');

module.exports = {

    async findAllSales() {
        const sales = await SalesModule.find().populate("products.product");

        return sales;
    },


    async createSale(sale) {
        const createSaleData = await SalesModule.create(sale);

        return createSaleData;
    },

    async findSalesInDateRange(date) {
        try {
          // Asegurarse de que la fecha esté en formato UTC
          const utcDate = new Date(date).toISOString();
      
          // Obtener la fecha de inicio (00:00:00) y la fecha de fin (23:59:59) del día
          const startDate = new Date(utcDate);
          const endDate = new Date(utcDate);
          endDate.setUTCHours(23, 59, 59, 999);
      
          // Realizar la agregación para obtener los nombres de los productos y la suma de los montos
          const salesInDateRange = await SalesModule.aggregate([
            {
              $match: {
                date: { $gte: startDate, $lte: endDate },
              },
            },
            {
              $unwind: "$products", // Desenrollar el array de productos
            },
            {
              $lookup: {
                from: "products", // Nombre de la colección de productos
                localField: "products.product",
                foreignField: "_id",
                as: "productInfo",
              },
            },
            {
              $unwind: "$productInfo", // Desenrollar el array de información del producto
            },
            {
              $group: {
                _id: "$products.product", // Agrupar por ID del producto
                totalAmount: { $sum: "$products.quantity" }, // Sumarizar la cantidad vendida
                productName: { $first: "$productInfo.name" }, // Tomar el nombre del producto
              },
            },
          ]);
      
          return salesInDateRange;
        } catch (error) {
          throw error;
        }
      }
      ,
}
