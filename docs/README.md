# E2E Test Helper

A helpful tool for locating UI elements for Cypress, Playwright, Selenium, Squish and other UI Test Tools
This extension comes to improve the experience of UI Test development.
While developing E2E tests (aka UI tests with Cypress, Playwright, Selenium, Squish and others), a developer can simply see the elements on the page and selectors for these elements.

### How to install

Detailed can be found here: https://e2eai.danduh.me/contribute/#loading-the-unpacked-extension-into-chrome

* Gow to [release page](https://github.com/danduh/e2e-ids-finder/releases)
* Download `package.zip` file
* unpack
* in Chrome navigate to [chrome://extensions](chrome://extensions)
* Click on **Load unpacked extension**
* Select the unpacked folder.

That's it... Any suggestions are welcome :)

## Create Page Objects for Cypress tests (Beta)

>Supports OpenAI and AzureAI only

This extension helps you to create a page objects for Cypress tests.

* Go to "Use AI" section and click on Scan button.
* Add page object name, and provide more details if needed (will be addedd to the prompt)
* Click on "Send Request" btn to create the page object.

### How to use

* Navigate to the page you are interested in checking (for example [my page](https://danduh.me))
* Click on the extension icon ![alt text](src/assets/icon-32.png "Extension Icon")
* Click on **Show elements with E2E**
* Hover with the mouse over selected elements.
* To clean all, - Click on the extension icon ![alt text](src/assets/icon-32.png "Extension Icon"), then click on **Hide**

### Change settings

* Click on the extension icon ![alt text](src/assets/icon-32.png "Extension Icon")
* Click on the **Settings** tab
* Do not forget to click on **Save**

# Build

```shell
npm run build
cd dist
zip package-<version>.zip -r e2e-test-helper/
```

