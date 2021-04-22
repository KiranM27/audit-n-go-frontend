import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;
public class AuditDetailTest {
    public static void main(String[] args) throws InterruptedException {

        String EmailId = "shrivijiani@gmail.com";
        String Password = "123456";

        // Change the link to the driver based on your local location
        System.setProperty("webdriver.chrome.driver","C:/Users/shriv/Documents/ChromeDriver/chromedriver.exe");
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
        Thread.sleep(2000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[2]/div/header/div/div/div/button[1]")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[2]/div/header/div/div/div/button[2]")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[2]/div/header/div/div/div/button[3]")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[2]/div/header/div/div/div/button[4]")).click();
        Thread.sleep(1000);
        
        // View institutions
        driver.findElement(By.xpath("/html/body/div[1]/div/div[1]/div/header/div/div[4]/button[2]")).click();
        Thread.sleep(1000);
        // Click 'View All'
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[1]/div[1]/div/div/button")).click();
        Thread.sleep(1000);
        //Click About
        driver.findElement(By.xpath("/html/body/div[1]/div/div[1]/div/header/div/div[4]/button[3]")).click();
        Thread.sleep(2000);
        //Click 'go audit'
        driver.findElement(By.xpath("/html/body/div[1]/div/div[1]/div/header/div/div[4]/button[1]")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div[1]/div/div/div[2]/button")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div/div/div[1]/div/div/div/div/button[2]")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/main/div/div/div[1]/div/div/div/input")).sendKeys("CGH");
        Thread.sleep(1000);



       

        driver.close();
    }
}
