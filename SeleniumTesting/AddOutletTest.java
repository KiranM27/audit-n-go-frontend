import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Keys;

public class AddOutletTest {
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

        driver.get("https://audit-n-go.technopanther.com/addOutlet");

        WebElement instSelect = driver
                .findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[1]/div/div/div/div/div[1]/div/div/input"));
        instSelect.sendKeys("SKH");
        Thread.sleep(1000);
        instSelect.sendKeys(Keys.DOWN);
        instSelect.sendKeys(Keys.ENTER);

        Thread.sleep(1000);

        WebElement outletName = driver.findElement(By.xpath(
                "/html/body/div[1]/div/div[2]/main/div[1]/div/div/div/div/div[2]/div/div/div/form/div[1]/div/input"));
        outletName.sendKeys("Test Outlet");
        Thread.sleep(1000);

        WebElement outletEmail = driver.findElement(By.xpath(
                "/html/body/div[1]/div/div[2]/main/div[1]/div/div/div/div/div[2]/div/div/div/form/div[2]/div/input"));
        outletEmail.sendKeys("TestOutlet@mail.com");

        Thread.sleep(2000);

        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[1]/div/div/div/div/div[2]/div/div/div/button")).click();
        Thread.sleep(2000);
        driver.switchTo().alert().accept();

        Thread.sleep(3000);

        driver.get("https://audit-n-go.technopanther.com/dashboard");
        Thread.sleep(4000);

        driver.close();
    }
}
