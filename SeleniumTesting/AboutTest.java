import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class AboutTest {
    public static void main(String[] args) throws InterruptedException {

        String EmailId = "shrivijiani@gmail.com";
        String Password = "123456";

        // Change the link to the driver based on your local location
        System.setProperty("webdriver.chrome.driver", "/Users/kiran/Desktop/SUTD/Misc/chromedriver");
        WebDriver driver = new ChromeDriver();

        // Ensure that the frontend and the backend of the app are running
        driver.get("https://audit-n-go.technopanther.com/");
        driver.manage().window().maximize();

        java.util.List<WebElement> formFields = driver.findElements(By.className("input"));

        // Logging in
        Thread.sleep(1000);
        formFields.get(0).sendKeys(EmailId);
        Thread.sleep(1000);
        formFields.get(1).sendKeys(Password);
        Thread.sleep(10000);
        driver.findElement(By.xpath("/html/body/div/div/div[1]/div[1]/div[4]/button")).click();

        Thread.sleep(4000);

        driver.get("https://audit-n-go.technopanther.com/about");

        java.util.List<WebElement> aboutPageLinks = driver.findElements(By.tagName("button"));

        for (int i = 0; i < aboutPageLinks.size(); i++) {
            try {
                if (i > aboutPageLinks.size() - 11) {
                    java.util.List<WebElement> aboutPageLinksRe = driver.findElements(By.tagName("button"));
                    aboutPageLinksRe.get(i).click();
                    Thread.sleep(3000);
                    if (driver.getCurrentUrl() != "https://audit-n-go.technopanther.com/about") {
                        System.out.println(driver.getCurrentUrl());
                        driver.navigate().back();
                        Thread.sleep(2000);
                    }
                }
            } catch (Exception e) {
                continue;
            }
        }
        Thread.sleep(3000);
        driver.close();
    }
}
