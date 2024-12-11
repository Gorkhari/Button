// ==UserScript==
// @name         Add Print Button to QuickBooks Invoice
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a "Print" button to the QuickBooks Invoice page with dynamic txnId
// @author       Raj - Gorkhari
// @match        https://qbo.intuit.com/app/invoice*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to check if the current page is an invoice page
    function isInvoicePage() {
        const url = window.location.href;
        return url.startsWith("https://qbo.intuit.com/app/invoice");
    }

    // Run the script only if the current page is an invoice page
    if (isInvoicePage()) {
        // Wait for the page to fully load before adding the button
        window.addEventListener('load', () => {
            // Check if the button already exists to avoid duplication
            if (document.getElementById('custom-print-button')) return;

            // Create the button element
            const printButton = document.createElement('button');
            printButton.id = 'custom-print-button';
            printButton.textContent = 'Print';
            printButton.style.position = 'fixed';
            printButton.style.bottom = '8px';
            printButton.style.left = '500px';
            printButton.style.padding = '10px 20px';
            printButton.style.backgroundColor = 'red';
            printButton.style.color = 'white';
            printButton.style.border = 'none';
            printButton.style.borderRadius = '5px';
            printButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            printButton.style.cursor = 'pointer';
            printButton.style.zIndex = '1000';

            // Add click event listener to the button
            printButton.addEventListener('click', () => {
                const billingAddress = document.querySelector('textarea.topFieldInput.address')?.value || '';
                const shippingAddress = document.getElementById('shippingAddress')?.value || '';
                const referenceNumberElement = document.querySelector('[data-qbo-bind="text: referenceNumber"]');
                const invoiceNumber = referenceNumberElement?.textContent?.trim() || '';
                const invoiceDateInput = document.getElementById('uniqName_8_5');
                const invoiceDate = invoiceDateInput?.value || '';

                // Get form details
                const formElement = document.querySelector('.custom-form');
                const formFields = Array.from(formElement.querySelectorAll('.custom-form-field'));
                const orderNumber = formFields.find(field => field.querySelector('label')?.textContent.trim() === 'ORDER NUMBER')?.querySelector('input')?.value || '';
                const jobName = formFields.find(field => field.querySelector('label')?.textContent.trim() === 'JOB NAME')?.querySelector('input')?.value || '';
                const phoneNumber = formFields.find(field => field.querySelector('label')?.textContent.trim() === 'Phone')?.querySelector('input')?.value || '';

                // Generate product list as a table
                let productTable = `
                    <table class="product-table">
                        <thead style="background:lightgrey; margin-bottom:5px;">
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                const rows = document.querySelectorAll('.dgrid-row');
                rows.forEach(row => {
                    const productNameElement = row.querySelector('.itemColumn');
                    const descriptionElement = row.querySelector('.field-description div');
                    const productName1 = productNameElement?.textContent.trim() || "";
                    const description = descriptionElement?.textContent.trim() || "";
                    const finalProductName = productName1 || description;
                    const sku = row.querySelector('.field-sku')?.textContent.trim() || '';
                    const quantity = row.querySelector('.field-quantity-inner')?.textContent.trim() || '';
                    productTable += `
                        <tr style="margin-bottom: 5px; height: 30px;">
                            <td style="padding: 5px 10px;">${finalProductName}</td>
                            <td style="padding: 5px 10px;">${sku}</td>
                            <td style="padding: 5px 10px;">${quantity}</td>
                        </tr>
                    `;
                });

                productTable += '</tbody></table>';

                // Use your provided print layout
                const printLayout = `
                    <html>
                    <head>
<style>
         .product-table tr {
                margin-bottom: 10px;
                height: 30px;
            }

            .product-table td {
                padding: 5px 10px;
            }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }

        .maincontainer {
            width: 80%;
            margin: 20px auto;
        }

        .TMheader-left {
              width:70%;
              display: flex;
              font-size: 13px;
          }

        .TMheader {
            width:100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: -25px;
        }

        .TMheader-left img {
            max-width: 150px;
        }

        .TMheader-right {
           width: 30%;
           font-size: 10px;
         }

        .deliveryNote {
         display: flex;
         margin-bottom: -30px;
         white-space: pre-line;
         flex-direction: row;
         justify-content: space-between;
         font-size: 14px;
        }

        .orderProducts {
            margin-top: 20px;
            border-top: 1px solid #000;
        }

        .product-table {
            text-align: justify;
            width: 100%;
            margin-top: 20px;
            font-size: 14px;
        }
        .orderNote {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
         .footer {
           position: relative;
           bottom: 0px;
           display: flex;
           flex-direction: column;
           align-items: center;
           font-size: 12px;
         }
    </style>
</head>
<body>
    <div class="maincontainer">
        <div class="TMheader">
            <div class="TMheader-left">
                <div class="imageLogo">
                    <img src="https://c17.qbo.intuit.com/qbo17/ext/Image/show/249862794341519/1?14857441280001" alt="Logo" />
                </div>
                <div class="CompnayInfo">
                    <div><b>Adelaide Bathroom & Kitchen Supplies</b></div>
                    <div>2/831 Lower North East Rd, Dernancourt</div>
                    <div>(08) 7006 5181</div>
                    <div>Sales@abksupplies.com.au</div>
                    <div>ABN 13 695 032 804</div>
                </div>
            </div>
            <div class="TMheader-right">
        <div class="QuoteHeaderLeft">
                                <div class="ContactSevice">
                                    <div><b>Received In Good Order & Condition</b></div>
                                    <div><textarea class="form-control" id="FormControlTextarea1" rows="1" style="height:30px;width:200px;" placeholder="Name:"></textarea></div>
                                    <div><textarea class="form-control" id="FormControlTextarea1" rows="1" style="height:40;width:200px;" placeholder="Sign:"></textarea></div>
                                    <div><textarea class="form-control" id="FormControlTextarea1" rows="1" style="height:30px;width:200px;"placeholder="Date: __ / __ / ____"></textarea></div>
                                </div>
                            </div>
            </div>
        </div>
        <h3 style="margin-bottom:0px">Delivery Note</h3>
        <div class="deliveryNote">
            <div class="deliveryNote-1">
                <b>INVOICE TO</b>
                <p class="InvoiceInfo">${billingAddress}</p>
            </div>
            <div class="deliveryNote-2">
                <b>SHIP TO</b>
                <p class="ShipInfo">${shippingAddress}</p>
            </div>
            <div class="deliveryNote-3">
                <b>INVOICE NO.:</b>
                <span class="InvoiceNumber">${invoiceNumber}</span>
                <b>DATE:</b>
                <span class="InvoiceDate">${invoiceDate}</span>
            </div>
        </div>
        <hr>
        <div class="orderNote">
            <div class="orderNote-1"><b>ORDER NUMBER</b><br/>${orderNumber}</div>
            <div class="orderNote-2"><b>JOB NAME<br/></b>${jobName}</div>
            <div class="orderNote-3"><b>PHONE<br/></b>${phoneNumber}</div>
        </div>
        <div class="orderProducts">
            ${productTable}
        </div>
        <hr/>
    </div>
</body>
</html>
                `;

                const newWindow = window.open('', '_blank', 'width=800,height=600');
                newWindow.document.write(printLayout);
                newWindow.document.close();
                newWindow.print();
            });

            // Add the button to the page
            document.body.appendChild(printButton);
        });
    }
})();
