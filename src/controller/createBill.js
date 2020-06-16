import { Tax } from "../constants/tax"
import async from "async"

export default function createBill(req, res) {
    try {
        let items = req.body.items
        let bill = {
            dateOfPurchase: new Date(),
            timeOfPurchase: new Date(),
            discount: 0,
            totalAmount: 0 
        }

        async.each(items, (item, cb) => {
            try {
                item["priceBeforeTax"] = item.quantity * item.price
                let taxCategory = Tax[item.itemCategory]
                taxCategory.taxes.every((taxSlab, i) => {
                    if(item["priceBeforeTax"] >= taxSlab.min) {
                        if(taxSlab.max){
                            if(item["priceBeforeTax"] <= taxSlab.max) {
                                item["tax"] = parseFloat((item["priceBeforeTax"] * taxSlab.value / 100).toFixed(2))
                                item["finalPrice"] = item["priceBeforeTax"] + item["tax"]
                                bill.totalAmount = item["finalPrice"];
                                return false;
                            }
                        } else {
                            item["tax"] = parseFloat((item["priceBeforeTax"] * taxSlab.value / 100).toFixed(2))
                            item["finalPrice"] = item["priceBeforeTax"] + item["tax"]
                            bill.totalAmount += item["finalPrice"];
                            return false;
                        }
                    }
                    return true;
                })
                cb()
            } catch (e) {
                cb(e)
            }
        }, (err) => {
            if (err) {
                console.log("Error occured while creating bill : ", err)
                res.status(500).json("Error in creating bill")
            }
        });

        /* Using Promises
        calculateBill(item) {
            return new Promise((resolve, reject) => {
                resolve(item)
                reject({message: , error})
            })
        }
        calculatediscount() {
            Tax["total"]
            resolve(bill)

        }

        Promise.all([calculateBill(0), calculateBill(1)])
            .then(results => {
                if (results && results.length) {
                    results[0] = item[0]
                }
                bill.items.push(results[i])
                return calculatediscount(bill)
            })
            .then(bill => {
                res.status(200).json(bill)
            })
            .catch(e => {
                console.log()
                res.status(500).json({message: })
            })
        
        */

        bill["items"] = items;

        if (Tax["Total"] && Tax["Total"].discounts && Tax["Total"].discounts.length) {
            Tax["Total"].discounts.every((discountSlab, i) => {
                if(bill["totalAmount"] >= discountSlab.min) {
                    if(discountSlab.max) {
                        if(discountSlab.max >= bill["totalAmount"]) {
                            bill["discount"] = parseFloat((bill["totalAmount"] * discountSlab.value / 100).toFixed(2))
                            bill.totalAmount = bill.totalAmount - bill["discount"]
                            return false;
                        }
                    } else {
                        bill["discount"] = parseFloat((bill["totalAmount"] * discountSlab.value / 100).toFixed(2))
                        bill.totalAmount = bill.totalAmount - bill["discount"]
                        return false;
                    }
                }
                return true
            })
        }

        res.status(200).json(bill)
    } catch(e) {
        console.log("Error occured while creating bill : ", e)
        res.status(500).json("Error in creating bill")
    }
}