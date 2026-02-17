import { test, expect, Page } from '@playwright/test';
import { CustomerFlow } from '../pageObject/customerFlow';
import testData from '../testData/customerFlow.json';

let customerFlowTest: CustomerFlow;

interface SharedData {
  randomText: string;
  randomEmail: string;
  randomPassWord: string;
}

const sharedData: SharedData = {
  randomText: testData.blankData,
  randomEmail: testData.blankData,
  randomPassWord: testData.blankData
};

test.beforeEach(async ({ page }: { page: Page }) => {
  customerFlowTest = new CustomerFlow(page);
});

test.describe.serial('Customer Flow', () => {

  test('Register as a new Customer', async ({ page }) => {

    sharedData.randomText = await customerFlowTest.getRandomString(8);
    sharedData.randomEmail = 
      `${testData.sharedData.emailStart}${sharedData.randomText}${testData.sharedData.emailEnd}`;
    sharedData.randomPassWord = 
      `${testData.sharedData.passWord}${sharedData.randomText}`;

    const user = {
      firstName: sharedData.randomText,
      lastName: sharedData.randomText,
      dob: testData.registerDetails.dateOfBirth,
      street: sharedData.randomText,
      postalCode: testData.registerDetails.postalCode,
      city: sharedData.randomText,
      state: sharedData.randomText,
      phone: testData.registerDetails.phoneNumber,
      email: sharedData.randomEmail,
      password: sharedData.randomPassWord,
      country: testData.registerDetails.country
    };

    // Browse the website 
    await page.goto(testData.testUrl);

    // Register to the web app
    await customerFlowTest.registerCustomer(user);
  });

  test('Log in as Customer', async ({ page }) => {

    // Browse the website 
    await page.goto(testData.testUrl);

    // Log in to the web app
    await customerFlowTest.login(sharedData.randomEmail, sharedData.randomPassWord);

  });

  test('Add an item to the Favorite tab', async ({ page }) => {

    // Browse the website 
    await page.goto(testData.testUrl);

    // Log in to the web app
    await customerFlowTest.login(sharedData.randomEmail, sharedData.randomPassWord);

    // Go to the Home
    await customerFlowTest.home.click();

    // Search for the specific item
    await customerFlowTest.searchItem(testData.listOfItem.combinationPliers);

    // Select the result
    const itemDisplayed = customerFlowTest.itemDisplay(testData.listOfItem.combinationPliers);
    await expect(itemDisplayed).toBeVisible();
    await itemDisplayed.click();

    // Add the item to the favorite
    await customerFlowTest.addFavoriteButton.click();

    // Go to the Profile > My favourites
    await customerFlowTest.profileMenu(`${sharedData.randomText} ${sharedData.randomText}`).click();
    await customerFlowTest.clickElement(customerFlowTest.myFavoriteLink);

    // Verify that the item is existing to the Favorite page
    await expect(
      customerFlowTest.productNameInFavoriteTab(testData.listOfItem.combinationPliers)
    ).toBeVisible();

  });

  test('Add an item to the Cart', async ({ page }) => {

    // Browse the website
    await page.goto(testData.testUrl);

    // Log in to the web app
    await customerFlowTest.login(sharedData.randomEmail, sharedData.randomPassWord);

    // Go to the Home
    await customerFlowTest.home.click();

    // Search for the specific item
    await customerFlowTest.searchItem(testData.listOfItem.boltCutters);

    // Verify the result after search
    const itemDisplayed = customerFlowTest.itemDisplay(testData.listOfItem.boltCutters);
    await expect(itemDisplayed).toBeVisible();

    // Get the price
    const productPriceAtListing =
      await customerFlowTest.productPriceText.textContent();

    // Select the item
    await itemDisplayed.click();

    // Add the item to the Cart
    await customerFlowTest.addToCartButton.click();

    // Go to the Cart
    await customerFlowTest.cartIcon.click();

    // Verify that the item is existing in the Cart
    await expect(customerFlowTest.productTitleInCart)
      .toHaveText(testData.listOfItem.boltCutters);

    // Verify the the item price is the same from menu
    const productPriceAtCart =
      await customerFlowTest.productPrice.textContent();
    await expect(productPriceAtCart).toBe(productPriceAtListing);

  });

  test('Checkout an item to the Cart', async ({ page }) => {

    // Browse the website
    await page.goto(testData.testUrl);

    // Log in to the web app
    await customerFlowTest.login(sharedData.randomEmail, sharedData.randomPassWord);

    // Go to the Home
    await customerFlowTest.home.click();

    // Search for the specific item
    await customerFlowTest.searchItem(testData.listOfItem.thorHammer);

    // Select the result
    const itemDisplayed = customerFlowTest.itemDisplay(testData.listOfItem.thorHammer);
    await expect(itemDisplayed).toBeVisible();
    await itemDisplayed.click();

    // Add the item to the Cart
    await customerFlowTest.addToCartButton.click();

    // Go to the Cart
    await customerFlowTest.cartIcon.click();

    // Verify that the item is existing in the Cart
    await expect(customerFlowTest.productTitleInCart)
      .toHaveText(testData.listOfItem.thorHammer);

    // Proceed to the checkout
    for (let i = 0; i < 3; i++) {
      await customerFlowTest.proceedToCheckoutButton.click();
    }

    // In the payment method tab, select an option
    await customerFlowTest.paymentMethodField.selectOption(
      testData.paymentMethod.cashOnDelivery
    );

    // Confirm the order
    await customerFlowTest.confirmButton.click();

    // Verify that the order is success
    await expect(customerFlowTest.paymentSuccessfulText).toBeVisible();

    // Click the Confirm button again to proceed
    await customerFlowTest.confirmButton.click();

    // Get the invoice
    const invoiceText =
      await customerFlowTest.orderConfirmationText.textContent();

    // Go to the Profile > My invoices
    await customerFlowTest.profileMenu(`${sharedData.randomText} ${sharedData.randomText}`).click();
    await customerFlowTest.myInvoiceLink.click();

    // Verify that the invoice number from the process is the same with the profile
    const invoiceNumberInInvoiceTab =
      await customerFlowTest.invoiceNumberTextInProfile.textContent();
    await expect(invoiceText).toContain(invoiceNumberInInvoiceTab);

  });

  test('Verify Category Feature', async ({ page }) => {
    
    // Browse the website 
    await page.goto(testData.testUrl);

    // Go to Category > Hand Tools 
    await customerFlowTest.categories.click();
    await customerFlowTest.handToolsLink.click();

    // Assertion to confirm that item displayed is relevant to Hand Tools
    while (true) {
      const nextButtonDisabled = await customerFlowTest.nextButton.isVisible();
      if (nextButtonDisabled) { 
        break; 
      }

      // List of power tools that should NOT be visible
      const powerTools = [
        testData.listOfItem.sheetSander,
        testData.listOfItem.circularSaw
      ];

      // Loop through each item and assert it's not visible
      for (const tool of powerTools) {
        await expect(customerFlowTest.itemDisplay(tool)).not.toBeVisible();
      }

      // Click the Next button
      await customerFlowTest.nextButton.click();
    }
  });
    
  test('Verify Sorting Feature', async ({ page }) => { 
    // Browse the website 
    await page.goto(testData.testUrl); 

    // Sort to Ascending 
    await customerFlowTest.sortDropDownField.selectOption(testData.sort.ascending); 
    
    // Assertion to confirm that item is sorted in Ascending 
    let tools = [ 
      testData.listOfItem.sheetSander, 
      testData.listOfItem.thorHammer 
    ]; 

    for (const tool of tools) { 
      // Loop through each item and assert it's not visible 
      await expect(customerFlowTest.itemDisplay(tool)).not.toBeVisible(); 
    }; 
    
    tools = [ 
      testData.listOfItem.boltCutters, 
      testData.listOfItem.circularSaw 
    ]; 

    for (const tool of tools) { 
      // Loop through each item and assert it's visible 
      await expect(customerFlowTest.itemDisplay(tool)).toBeVisible(); 
    }; 

    // Sort to Descending 
    await customerFlowTest.sortDropDownField.selectOption(testData.sort.descending); 

    // Assertion to confirm that item is sorted in Descending 
    tools = [ 
      testData.listOfItem.combinationPliers, 
      testData.listOfItem.boltCutters, 
      testData.listOfItem.circularSaw 
    ]; 

    for (const tool of tools) { 
      // Loop through each item and assert it's not visible 
      await expect(customerFlowTest.itemDisplay(tool)).not.toBeVisible(); 
    }; 

    tools = [ 
      testData.listOfItem.thorHammer, 
      testData.listOfItem.toolCabinet 
    ]; 

    for (const tool of tools) { 
      // Loop through each item and assert it's visible 
      await expect(customerFlowTest.itemDisplay(tool)).toBeVisible(); 
    }; 
  }); 

  test('Verify Filter Feature', async ({ page }) => { 
    // Browse the website 
    await page.goto(testData.testUrl);

    // Filter the list of item by Hammer 
    await customerFlowTest.hammerCheckbox.click(); 

    // Assertion to confirm that item is sorted in Ascending 
    let tools = [ 
      testData.listOfItem.sheetSander, 
      testData.listOfItem.combinationPliers, 
      testData.listOfItem.boltCutters, 
      testData.listOfItem.circularSaw, 
      testData.listOfItem.toolCabinet 
    ]; 

    for (const tool of tools) { 
      // Loop through each item and assert it's not visible 
      await expect(customerFlowTest.itemDisplay(tool)).not.toBeVisible(); 
    }; 

    tools = [ 
      testData.listOfItem.thorHammer, 
      testData.listOfItem.sledgeHammer, 
      testData.listOfItem.courtHammer 
    ]; 

    for (const tool of tools) { 
      //Loop through each item and assert it's visible 
      await expect(customerFlowTest.itemDisplay(tool)).toBeVisible(); 
    }; 
  }); 

  test('Verify Language', async ({ page }) => { 
    // Browse the website 
    await page.goto(testData.testUrl); 

    // Select a German as Language 
    await customerFlowTest.languageButton.click(); 
    let selectLanguage = 
      customerFlowTest.languageOption(testData.languages.german); 
    await selectLanguage.click(); 

    // Assertion to confirm the language is changed to German 
    let titles = await customerFlowTest.pageTitles; 
    let count = await titles.count(); 
    
    // Get total count 
    for (const keyword of testData.germanKeywords) { 
      //Loop through keywords and check if any h2 contains each one 
      let found = false; for (let i = 0; i < count; i++) { 
        const text = await titles.nth(i).innerText(); 
        if (text.toLowerCase().includes(keyword.toLowerCase())) { 
          found = true; 
          break; 
        }; 
      }; 
      await expect(found).toBeTruthy(); 
    }; 
    
    // Select a Spanish as Language 
    await customerFlowTest.languageButton.click(); 
    selectLanguage = 
      await customerFlowTest.languageOption(testData.languages.spanish); 
    await selectLanguage.click(); 
    
    // Assertion to confirm the language is changed to Spanish 
    titles = await customerFlowTest.pageTitles; 
    count = await titles.count(); 
    
    // Get total count 
    for (const keyword of testData.spanishKeywords) { 
      // Loop through keywords and check if any h4 contains each one 
      let found = false; 
      for (let i = 0; i < count; i++) { 
        const text = await titles.nth(i).innerText(); 
        if (text.toLowerCase().includes(keyword.toLowerCase())) { 
          found = true; 
          break; 
        }; 
      }; 
      await expect(found).toBeTruthy(); 
    }; 
  }); 

  test('Verify Contact Feature', async ({ page }) => { 

    const contact = {
      firstName: sharedData.randomText,
      lastName: sharedData.randomText,
      email: sharedData.randomEmail,
      subject: testData.subject,
      messageText: testData.testMessage,
      filePath: testData.file.path
    };

    // Browse the website 
    await page.goto(testData.testUrl); 

    // Go to Contact 
    await customerFlowTest.contact.click(); 
    
    // Fill up the Contact form 
    await customerFlowTest.fillUpContactForm(contact);

    // Assertion to confirm that the contact form is successfully submitted 
    await expect(customerFlowTest.contactSuccessAlert).toBeVisible(); 
  });
});