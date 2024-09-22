<style scoped>
/* Container spacing */
.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Form styling */
.form-container input,
.form-container textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-container select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-container label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
}

.form-container textarea {
  height: 100px;
  resize: none;
}

/* Table styling */
.table-container {
  margin-top: 20px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th,
.custom-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.custom-table th {
  background-color: #7c7c7c;
  font-weight: bold;
}

.custom-table td input{
  width: 100%;
  padding: 8px;
  border: 1px solid #000000;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Button styling */
.custom-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.generate-button {
  background-color: #00ff37;
  font-size: large;
  color: white;
  padding: 20px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.custom-button:hover {
  background-color: #0056b3;
}
input[type="checkbox"] {
  display: inline;
}
</style>


<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from '../assets/company_logo';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
    data() {
        return {

        company: 'Caonyx LTD',
        address: `Achelloou 2, Aradippou`,
        municipality: "Larnaca",
        post: '7103',
        country: 'Cyprus',
        phone: '+357 97750012',
        email: 'info@caonyx.com',
        bill_to: '\n',
        num: '',
        terms: 'cheque',
        tax_id: '60087675R',
        type: 'QUOTE',
        tax: 0,
        title: ' ',
        description: '',
        amount: 0,
        amount_at: 0,
        discount: 0,
        amount_ad: 0,
        show_discount: false,
        date: new Date().toISOString().substring(0, 10),
        items: [
            { description: '', rate: 0, quantity: 0, price: 0 },
        ],};


    },
    methods: {
        addItem() {
            this.items.push({ description: '', rate: 0, quantity: 0, price: 0 });
        },
        calculatePrice(item) {
          item.price = item.rate * item.quantity;
          this.calculateTotal(this.items);
          this.calculateTotalAfterTax();
        },
        calculateTotal(items) {
            this.amount = items.reduce((acc, item) => acc + item.price, 0);
        },
        calculateTotalAfterTax() {
            this.amount_at = this.amount_ad + (this.amount_ad * this.tax / 100);
        },
        calculateTotalAfterDiscount(){ 
          this.amount_ad = this.amount - (this.amount * (this.discount/100))
        },
        generateQuote() {
            var docDefinition = {
                content: [
                  {
                    columns: [
                      {
                        stack: [
                          { text: this.type, style: 'header', fontSize: 32 },
                          { text: `#${this.type}${this.num}`, fontSize: 14, margin: [0, 0, 0, 0], color: "#bdbdbd"},
                          
                        ]
                      }
                    ]
                  },
                    {          
                       columns: [
                          {},
                            {
                                width: 200,
                                svg: logo,
                                margin: [20, -60, 0, 0],
                            },
                        ],                        
                        margin: [0, 0, 0, 40],
                    },
                    {text: 'Issued by:', color: "#bdbdbd"},
                    {text: this.company, bold: true, fontSize: 12, margin:[0,5,0,0]},
                    {text: this.address, fontSize: 12, margin: [0, 5, 0, 0]},
                    {text: `${this.post} ${this.country} ${this.municipality}`, fontSize: 12, margin: [0, 5, 0, 0]},

                    {text: this.phone, fontSize: 12, margin: [0, 5, 0, 0]},
                    {text: this.email, fontSize: 12, margin: [0, 5, 0, 0]},
                    {
                      margin:[0,5,0,0],
                      columns :
                      [ 
                        { text: "Tax ID:", color: "#bdbdbd" , margin:[0,3,0,0]}, 
                        {text: this.tax_id, fontSize: 10, margin:[-218,5,0,0]} 
                      ],
                    },
                    {
                      columns:
                      [ 
                        { text: 'Reg Number:', color: "#bdbdbd" , margin:[0,3,0,0]}, 
                        {text: "HE 460570", fontSize: 10, margin:[-185,5,0,0]}
                      ],

                    },
                    {   
                      columns: [
                            {},                            
                            {
                              margin: [85, -153, 0, 0],
                              
                              layout: 'noBorders',
                              table: {
                                headerRows: 0,
                                widths: [ 100, 80],
                                body: [
                                  [ { text: 'Date:', color: "#bdbdbd", alignment: 'left', }, {text: this.date, alignment:'right', fontSize: 10} ],
                                  [{ text: 'Payment Terms:', color: "#bdbdbd", alignment: 'left', }, {text: this.terms, alignment:'right', fontSize: 10} ],
                                ]
                              }
                            },
                      ],
                    },
                    {text: `Bill To: ${this.bill_to}`, style: 'subheader', margin: [0, 20, 0, 28], color: "#5c5c5c", fontSize: 14},
                    {text: this.title, fontSize: 18},
                    {canvas: 
                      [
                      { 
                        type: 'rect',
                        x: -15,
                        y: 0,
                        w: 560,
                        h: 18,
                        r: 5,
                        lineColor: '#444444',
                        color: '#444444',
                      },
                    ],
                    absolutePosition: {x: 40, y: 385},
                    margin: [0, 17, 0, 0],
                    },
                    {
                      margin: [0, 0, 0, 0],
                      
                      layout: {
                        
                        hLineWidth: function (i, node) {
                          return 0; 
                        },
                        vLineWidth: function (i, node) {
                          return 0;
                        },
                      }, 
                      table: {
                        headerRows: 1,
                        widths: [ 290, 50, 80, 75 ],
                        body: [
                          [ {text:'Item', color: "#FFFFFF"}, {text:'Quantity', color: "#FFFFFF", alignment: 'right'}, {text:'Rate', color: "#FFFFFF", alignment: 'right'}, {text:'Amount', color: "#FFFFFF", alignment: 'right'} ],
                          ...this.items.map(item =>{ 
                            return [{text: item.description, alignment:'left', lineHeight: 1.5}, {text: item.quantity, lineHeight: 1.5, alignment: 'right'}, {text: `€${item.rate}`, alignment:'right', lineHeight: 1.5}, {text: ` €${item.price}`, lineHeight: 1.5, alignment:'right'}];
                          })

                        ],
                      },
                   },
                   {text: `Total Amount: €${this.amount}`, style: 'subheader', margin: [0, 40, 0, 0]},
                   {text: `Discount: %${this.discount}`, style: 'subheader', margin: [0, 5, 0, 0]}, //Todo make a function that allows you to show discount field or not
                   {text: `VAT: %${this.tax}`, style: 'subheader', margin: [0, 10, 0, 0]},
                   {text: `Total Amount After VAT: €${this.amount_at}`, style: 'subheader', margin: [0, 10, 0, 0]},
                ],
            };
            pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs).open();

        },
    },
    };
</script>



<template>
    <form class="form-container">

      <div class="row">

        <div class="col-md-6 mb-3">
          <label for="type">Type</label>
          <select v-model="type" type="text" id="type" >
            <option value="QUOTE">Quote</option>
            <option value="INVOICE">Invoice</option>
          </select>
        </div>

        
        <div class="col-md-6 mb-3">
          <label for="author">Company</label>
          <input v-model="company" type="text" id="author" />
        </div>

        <div class="col-md-6 mb-3">
          <label for="address">Address</label>
          <input v-model="address" type="text" id="address" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="post">Post</label>
          <input v-model="post" type="text" id="post" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="municipality">Municipality</label>
          <input v-model="municipality" type="text" id="municipality" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="country">Country</label>
          <input v-model="country" type="text" id="country" />
        </div>
      </div>
  
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="phone">Phone</label>
          <input v-model="phone" type="text" id="phone" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" />
        </div>
      </div>
  
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="bill">Bill to:</label>
          <input v-model="bill_to" type="text" id="bill" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="date">Date</label>
          <input v-model="date" type="date" id="date" />
        </div>
      </div>
  
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="Title">Title</label>
          <input v-model="title" type="text" id="Title" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="description">Description</label>
          <textarea v-model="description" id="description"></textarea>
        </div>
      </div>

      <div class="mb-3">
        <label for="inv-num">Payment terms</label>
        <select v-model="terms">
          <option value="cheque"></option>
          <option value="cheque">Cheque</option>
          <option value="cash">Cash</option>
          <option value="cash">Bank Transfer</option>

        </select>
       
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="tax">Tax ID </label>
          <input v-model="tax_id" type="text" id="tax_id" />
        </div>
        <div class="col-md-4 mb-3">
          <label for="tax">VAT (%)</label>
          <input v-model="tax" @input="calculateTotalAfterTax()" type="number" id="tax" />
        </div>

        <div class="col-md-4 mb-3">
          <label for="discount">Discount</label>
          <input v-model="discount" @input="calculateTotalAfterDiscount()" type="number" id="discount" />
        </div>

        <div class="col-md-4 mb-3">
          <label for="show_discount">Show Discount</label>
          <input v-model="show_discount" type="checkbox" id="show_discount" />

        </div>
      </div>
      
      <div class="mb-3">
        <label for="num">Invoice/Quote Number</label>
        <input v-model="num" type="text" id="num" />
      </div>
  
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Rate</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td><input type="text" v-model="item.description" /></td>
              <td><input type="number" v-model="item.rate" @input="calculatePrice(item)" /></td>
              <td><input type="number" v-model="item.quantity" @input="calculatePrice(item)" /></td>
              <td><input type="number" v-model="item.price" readonly /></td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="custom-button" @click="addItem">Add Item</button>

        <div class="col-md-4 mb-3">
          <label for="amount">Total Amount</label>
          <input v-model="amount" type="number" id="amount" readonly />
        </div>
        
        <div class="col-md-4 mb-3">
          <label for="amount_ad">Total Amount After Discount</label>
          <input v-model="amount_ad" type="number" id="amount_ad" readonly />
        </div>

        <div class="col-md-4 mb-3">
          <label for="amount_at">Total Amount After VAT</label>
          <input v-model="amount_at" type="number" id="amount_at" readonly />
        </div>

        <div>
            <button type="button" class="generate-button" @click="generateQuote">Generate Quote</button>  
        </div>

      </div>
    </form>
  </template>
  