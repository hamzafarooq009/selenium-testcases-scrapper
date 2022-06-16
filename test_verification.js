// This code open chrome new instance with an existing chrome user profile located at /Users/Ishrat/Desktop/ChromeProfile
// Chrome profile must be created and passed as argument to the webdriver to use login information for educative.io
// There is no need to open chrome in debugger mode, hence, we wont need anything of the following sort
// //options.addArguments('debuggerAddress=127.0.0.1:9222');

// 0-5 - test
// 6-11 - sol1
// 12 - 17 - sol2

var anchor_number = 2;
var goBack = false;
var buttonLength = 0;
var buttonIndex = 0;
var TIME_OUT = 5000;
var TIME_OUT_TRANSITION = 5000;
var course_title = "";
var lesson_title = "";
var language = "C++";
language = language.toLowerCase();
var url = "https://www.educative.io/courses/coderust-hacking-the-coding-interview";
const { link } = require("fs");
const { Options } = require("selenium-webdriver/chrome");
const { setTimeout } = require("timers");
const options = new Options();
options.addArguments("--user-data-dir=/Users/Hamza/Desktop/ChromeProfile");
const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  until = webdriver.until;
const driver = new webdriver.Builder()
  .setChromeOptions(options)
  .forBrowser("chrome")
  .build();

const quit_chrome = () => {
  driver.quit();
};

// driver.Key
const quit = () => {
  console.log("Quitting chrome...");
  setTimeout(quit_chrome, TIME_OUT_TRANSITION);
};
// Locates the code tabs widgets present in the lesson, if found, the edit button is pressed, otherwise we'll move to the next lesson.
const findCodeTabsTYI = async () => {
  driver
  .wait(
    until.elementsLocated(
      By.xpath("//div[contains(@class,'flex flex-wrap w-full')]//button"),
      ),
    TIME_OUT,
    "Timed out",
    10000000
  )
  .then(async (codeTabs) => {
    // codeTabs[1]
    await codeTabs[0].click();
    setTimeout(pasteCodeWidget,TIME_OUT_TRANSITION);
  })
  .catch((err) => {
    console.log("Code Tabs Widget not found!!!");
    goBack = true;
    loadNextLesson();
  })
}

// Locates the code tabs widgets present in the lesson, if found, the edit button is pressed, otherwise we'll move to the next lesson.
const findCodeTabsSolution = async () => {
  driver
  .wait(
    until.elementsLocated(
      By.xpath("//div[contains(@class,'flex flex-wrap w-full')]//button"),
      ),
    TIME_OUT,
    "Timed out",
    10000000
  )
  .then(async(codeTabs) => {
    // The click will click the python code
    await codeTabs[6].click();
    setTimeout(copyCodeWidget,TIME_OUT_TRANSITION);
  })
  .catch((err) => {
    console.log("Code Tabs Widget not found!!!");
    goBack = true;
    loadNextLesson();
  })
}

const extractInfo = async () => {
  driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[@class='ed-grid']//div[contains(@class,'ArticlePage__ArticlePageStyled-sc-1eiji3g-0 jmMkMe')]//tbody[contains(@class,'border border-solid border-gray-300 dark:border-gray-A100 whitespace-pre-wrap')]//tr"),
      ),
      TIME_OUT,
      "Timed out",
      100000
    )
    .then(async (info) => {
      console.log("Extracting info")
      for (let i = 0; i < info.length; i++) {
        text = await info[i].getText();
        console.log(text);
      }

      if (buttonIndex >= buttonLength) {
        goBack = true;
        setTimeout(loadNextLesson, TIME_OUT_TRANSITION);
      }
    })
    .catch((err => {
      console.log("error in the code: ", err);

    }))
}

// Locates the code tabs widgets present in the lesson, if found, the edit button is pressed, otherwise we'll move to the next lesson.
const pressTestButton = async () => {
  driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[@class='ed-grid']//div[contains(@class,'ArticlePage__ArticlePageStyled-sc-1eiji3g-0 jmMkMe')]//button[contains(@class,'contained-primary py-2 m-2 ml-0')]"),
      ),
      TIME_OUT,
      "Timed out",
      300000
    )
    .then(async (testButtons) => {
      await testButtons[0].click();
      console.log("Test button clicked");
      setTimeout(extractInfo, TIME_OUT_TRANSITION);
    })
    .catch((err) => {
      console.log("Test button not clicked");
      goBack = true;
      loadNextLesson();
    })
}

// Scrolling 
const scrollDown = async () => {
    driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[contains(@class,'block')]//div[contains(@class,'code-container')]"),
        ),
      TIME_OUT,
      "Timed out",
      300000
    )
    .then( async (codeWidget) => {
      console.log("Scrolling to the solution");
        await driver.executeScript("arguments[0].scrollIntoView();", codeWidget[1]);
        await driver.executeScript("window.scrollBy(0,-200)");
        
        setTimeout(findCodeTabsSolution,TIME_OUT_TRANSITION);
    })
    .catch((err) => {
      console.log("Can not scroll");
    })
}

// Locates the unexplored code tabs widget and scrolls to it
const scrollUp = async () => {
  driver
  .wait(
    until.elementsLocated(
      By.xpath("//div[contains(@class,'block')]//div[contains(@class,'code-container')]"),
      ),
    TIME_OUT,
    "Timed out",
    300000
  )
  .then( async (codeWidget) => {
    console.log("Scrolling up to Try it yourself section");
      await driver.executeScript("arguments[0].scrollIntoView();", codeWidget[0]);
      await driver.executeScript("window.scrollBy(0,-200)");
      setTimeout(findCodeTabsTYI,TIME_OUT_TRANSITION);
  })
  .catch((err) => {
    console.log("Can not scroll");
  })
}

const deleteCode = async () => {
  driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[contains(@class,'block')]//div[contains(@class,'code-container')]//textarea[contains(@class,'inputarea monaco-mouse-cursor-text')]"),
      ),
      TIME_OUT,
      "Timed out",
      3000
    )
    .then(async(codeWidgets) => {
      console.log("hello deletecode")
      
      let del = webdriver.Key.chord(webdriver.Key.COMMAND, "a") + webdriver.Key.DELETE
      await codeWidgets[0].sendKeys(del);
      let writeCode = webdriver.Key.chord(webdriver.Key.COMMAND, "v")
      await codeWidgets[0].sendKeys(writeCode);

      //for c++ enter key to remove int main till end of the file//
      let findingIntMain = webdriver.Key.chord(webdriver.Key.COMMAND, "f") + "int main()" + (webdriver.Key.ESCAPE + webdriver.Key.SHIFT + webdriver.Key.COMMAND + webdriver.Key.ARROW_DOWN)
      await codeWidgets[0].sendKeys(findingIntMain);
      await codeWidgets[0].sendKeys(webdriver.Key.DELETE)
      //------------------------------------------------------------------//
      setTimeout(pressTestButton, 10000)
    })
    .catch((err) => {
      console.log("Cannot hello the code: ", err);
      goBack = true;
      loadNextLesson();
    })
}

const pasteCodeWidget = async () => {
  driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[contains(@class,'block')]//div[contains(@class,'code-container')]//div[contains(@class,'monaco-scrollable-element editor-scrollable vs-dark mac')]"),
      ),
      TIME_OUT,
      "Timed out",
      300000
    )
    .then(async (codeWidgets) => {
      
      await codeWidgets[0].click()
      let test = await driver.switchTo().activeElement()
      console.log("outer");
      outer = await test.getAttribute('outerHTML')
      setTimeout(deleteCode, 1000)
    })
    .catch((err) => {
      console.log("Cannot paste the code: ", err);
      goBack = true;
      loadNextLesson();
    })
}

// Locates the code tabs widgets present in the lesson, if found, the edit button is pressed, otherwise we'll move to the next lesson.
const copyCodeWidget = async () => {
  driver
    .wait(
      until.elementsLocated(
        By.xpath("//div[contains(@class,'block')]//div[contains(@class,'code-container')]//div[contains(@class,'styles__Buttons-sc-2pjuhh-2 bkVZgl')]"),
      ),
      TIME_OUT,
      "Timed out",
      300000
    )
    .then(async (codeWidgets) => {
      await codeWidgets[1].click();
      // console.log(code)
      setTimeout(scrollUp, TIME_OUT_TRANSITION);
    })
    .catch((err) => {
      console.log("Cannot copy the code: ", err);
      goBack = true;
      loadNextLesson();
    })
}

// Locates the lesson links and recieves them in the form of a list. It will then go to the lesson link specified by the anchor_number variable.
function loadNextLesson_sub() {
  driver.getCurrentUrl().then((url) => {
    console.log(
      "loading lesson at URL: " +
      url +
      " lesson no: " +
      anchor_number
    );
  });
  driver
    .wait(
      until.elementsLocated(
        By.xpath(
          "//div[contains(@class,'flex flex-col mb-14')]//span[@class='text-base font-normal']" //Returns links of all the lessons
        )
      ),
      TIME_OUT,
      "Timed out after 30 seconds",
      300000
    )
    .then(async (links) => {
      if (anchor_number < links.length) {
        lesson_title = await links[anchor_number].getText();
        console.log("Lesson title:" + lesson_title);
        links[anchor_number].click();
        anchor_number++;
        setTimeout(scrollDown, TIME_OUT_TRANSITION);
      } else {
        console.log("Course Scanned");
        quit();
      }
    })
    .catch((err) => {
      driver.getCurrentUrl().then((url) => {
        console.log(
          "Element on course editor NOT found: " + err + "at URL: " + url
        );
        driver.navigate().to(url);
        setTimeout(loadNextLesson, TIME_OUT_TRANSITION);

      });
    });
}

// Loads the next unexplored lesson
const loadNextLesson = async () => {
  if (goBack == true) {
    goBack = false;
    await driver.navigate().back();
  }
  setTimeout(loadNextLesson_sub, TIME_OUT_TRANSITION);
};

// Only fetches the course title and call next lesson
const fetchCourseTitle = () => {
  driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[contains(@class,'flex flex-col')]//h1[@class='text-4xl text-left font-semibold mt-0 mr-0 mb-2']"
        )
      ),
      TIME_OUT,
      "Timed out after 30 seconds",
      300000
    )
    .then((module_h1) => {
      console.log("Course title found")
      module_h1.getAttribute("textContent").then((title) => {
        course_title = title;
        console.log("Course Title :: " + course_title);
        loadNextLesson();
      });
    })
    .catch(() => {
      console.log("Course title could not be fetched");
    });
};

// Opens the specified course link 
const getCourseEditorPage = async () => {
  await driver.get(
    url
  );
  setTimeout(fetchCourseTitle, 5000);
};

getCourseEditorPage();


// -> xPath template for common elements
// class="block"
// class="code-container"
// class="styles__Buttons-sc-2pjuhh-2 bkVZgl"

// xPath = "//div[contains(@class,'block')]//div[contains(@class,'code-container')]//div[contains(@class,'styles__Buttons-sc-2pjuhh-2 bkVZgl')]"

// xpath = "//div[contains(@class,'flex flex-wrap w-full')]"
