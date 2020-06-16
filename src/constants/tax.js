export const Tax = {
    "Book": {
        name: "Book",
        taxes: [{
            min: 0,
            value: 0,
        }],
    },
    "Clothes": {
        name: "Clothes",
        taxes: [{
            min: 0,
            value: 5,
            max: 999
        }, {
            min: 1000,
            value: 12,
        }],
    },
    "Food": {
        name: "Food",
        taxes: [{
            min: 0,
            value: 5,
        }],
    },
    "Imported": {
        name: "Imported",
        taxes: [{
            min: 0,
            value: 18,
        }],
    },
    "Medicine": {
        name: "Medicine",
        taxes: [{
            min: 0,
            value: 5,
        }],
    },
    "Music": {
        name: "Music",
        taxes: [{
            min: 0,
            value: 3,
        }],
    },
    "Total": {
        name: "Total",
        discounts: [{
            min: 2000,
            value: 5,
        }]
    }
}