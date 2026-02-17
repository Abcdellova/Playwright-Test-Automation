import { Page, Locator } from '@playwright/test';

export class CustomerFlow {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get home(): Locator {
    return this.page.getByRole('link', { name: 'Home' });
  }

  get categories(): Locator {
    return this.page.getByRole('button', { name: /Categories/ });
  }

  get contact(): Locator {
    return this.page.getByRole('link', { name: 'Contact' });
  }

  get signInButton(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  profileMenu(userName: string): Locator {
    return this.page.getByRole('button', { name: userName });
  }

  get cartIcon(): Locator {
    return this.page.getByRole('link', { name: 'cart' });
  }

  get languageButton(): Locator {
    return this.page.locator('#language');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' })
  }

  get registerLink(): Locator {
    return this.page.getByRole('link', { name: 'Register your account' });
  }

  get firstNameField(): Locator {
    return this.page.locator("#first_name");
  }

  get lastNameField(): Locator {
    return this.page.locator("#last_name");
  }

  get dateOfBirthField(): Locator {
    return this.page.locator("#dob");
  }

  get streetField(): Locator {
    return this.page.locator("#street");
  }

  get postalCodeField(): Locator {
    return this.page.locator("#postal_code");
  }

  get cityField(): Locator {
    return this.page.locator("#city");
  }

  get stateField(): Locator {
    return this.page.locator("#state");
  }

  get countryDropDown(): Locator {
    return this.page.locator("#country");
  }

  get phoneField(): Locator {
    return this.page.locator("#phone");
  }

  get emailField(): Locator {
    return this.page.locator("#email");
  }

  get passWordField(): Locator {
    return this.page.locator("#password");
  }

  get registerButton(): Locator {
    return this.page.getByRole('button', { name: 'Register' })
  }

  get favoriteTab(): Locator {
    return this.page.locator("app-overview a[href*='favorite']");
  }

  get profileTab(): Locator {
    return this.page.locator("app-overview a[href*='profile']");
  }

  get invoicesTab(): Locator {
    return this.page.locator("app-overview a[href*='invoices']");
  }

  get messagesTab(): Locator {
    return this.page.locator("app-overview a[href*='messages']");
  }

  get searchButton(): Locator {
    return this.page.getByRole('button', { name: 'Search' });
  }

  get addFavoriteButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to favourites' });
  }

  get myFavoriteLink(): Locator {
    return this.page.getByRole('link', { name: 'My favorites' });
  }

  productNameInFavoriteTab(product: string): Locator {
    return this.page.getByRole('heading', { name: product });
  }

  get productPriceText(): Locator {
    return this.page.locator('[data-test="product-price"]');
  }

  get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  get productTitleInCart(): Locator {
    return this.page.locator('.product-title');
  }

  get productPrice(): Locator { 
    return this.page.locator("span[data-test='product-price']"); 
  }

  get proceedToCheckoutButton(): Locator {
    return this.page.getByRole('button', { name: /Proceed to checkout/i });
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: 'Confirm' });
  }

  get paymentMethodField(): Locator {
    return this.page.locator('#payment-method');
  }

  get paymentSuccessfulText(): Locator {
    return this.page.locator('.help-block');
  }

  get orderConfirmationText(): Locator {
    return this.page.locator('#order-confirmation')
  }

  get myInvoiceLink(): Locator {
    return this.page.getByRole('link', { name: 'My invoices' });
  }

  get invoiceNumberTextInProfile(): Locator { 
    return this.page.locator("table td:first-of-type"); 
  }

  get handToolsLink(): Locator {
    return this.page.getByRole('link', { name: 'Hand Tools' });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: 'Next' });
  }

  get sortDropDownField(): Locator {
    return this.page.getByRole('combobox', { name: /sort/i });
  }

  get hammerCheckbox(): Locator {
    return this.page.getByLabel('Hammer');
  }

  async getRandomString(length: number = 8): Promise<string> {
    return Math.random().toString(36).slice(2, 2 + length);
  }

  get sendButton(): Locator {
    return this.page.getByRole('button', { name: 'Send' });
  }

  async searchItem(itemName: string): Promise<void> {
    const currentValue = await this.searchField.inputValue();

    if (currentValue !== itemName) {
      await this.searchField.fill(itemName);
    }

    await this.searchButton.click();
  }

  get searchField(): Locator {
    return this.page.locator("input#search-query");
  }

  itemDisplay(itemName: string): Locator {
    return this.page.locator(`a.card img[alt='${itemName}']`);
  }

  languageOption(language: string): Locator {
    return this.page.locator(`a[data-test="lang-${language.toLowerCase()}"]`);
  }

  get pageTitles(): Locator {
    return this.page.locator('h2, h3, h4');
  }

  get subjectDropDownField(): Locator {
    return this.page.locator('select[data-test="subject"]');
  }

  get messageTextAreaField(): Locator {
    return this.page.locator('#message');
  }

  get uploadFileField(): Locator {
    return this.page.locator('#attachment');
  }

  get contactSuccessAlert(): Locator {
    return this.page.locator('.alert-success')
  }

  async setInputValue(element: Locator, value: string): Promise<void> {
    const currentValue = await element.inputValue();
    if (currentValue !== value) {
      await element.fill(value);
    }
  }

  async clickElement(element: Locator): Promise<void> {
    await element.click();
  }

  async login(email: string, passWord: string): Promise<void> {
    await this.signInButton.click();

    await this.emailField.fill(email);
    await this.passWordField.fill(passWord);

    await this.loginButton.click();
  }

  async registerCustomer(data: {
    firstName: string;
    lastName: string;
    dob: string;
    street: string;
    postalCode: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
    country: string;
  }): Promise<void> {

    await this.signInButton.click();
    await this.registerLink.click();

    await this.firstNameField.fill(data.firstName);
    await this.lastNameField.fill(data.lastName);
    await this.dateOfBirthField.fill(data.dob);
    await this.streetField.fill(data.street);
    await this.postalCodeField.fill(data.postalCode);
    await this.cityField.fill(data.city);
    await this.stateField.fill(data.state);
    await this.phoneField.fill(data.phone);
    await this.emailField.fill(data.email);
    await this.passWordField.fill(data.password);
    await this.countryDropDown.selectOption(data.country);

    await this.registerButton.click();
  }

  async fillUpContactForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    messageText: string;
    filePath: string;
  }): Promise<void> {

    await this.contact.click();

    await this.firstNameField.fill(data.firstName);
    await this.lastNameField.fill(data.lastName);
    await this.emailField.fill(data.email);
    await this.messageTextAreaField.fill(data.messageText);
    await this.subjectDropDownField.selectOption(data.subject);
    await this.uploadFileField.setInputFiles(data.filePath)

    await this.sendButton.click();
  }
}
