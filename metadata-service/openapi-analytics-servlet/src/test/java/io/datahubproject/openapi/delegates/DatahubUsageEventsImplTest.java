package io.datahubproject.openapi.delegates;

import com.linkedin.data.schema.annotation.PathSpecBasedSchemaAnnotationVisitor;
import io.datahubproject.openapi.config.OpenAPIAnalyticsTestConfiguration;
import io.datahubproject.openapi.config.SpringWebConfig;
import io.datahubproject.openapi.generated.controller.DatahubUsageEventsApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;


@SpringBootTest(classes = {SpringWebConfig.class})
@ComponentScan(basePackages = {"io.datahubproject.openapi.generated.controller"})
@Import({DatahubUsageEventsImpl.class, OpenAPIAnalyticsTestConfiguration.class})
public class DatahubUsageEventsImplTest extends AbstractTestNGSpringContextTests {
    @BeforeTest
    public void disableAssert() {
        PathSpecBasedSchemaAnnotationVisitor.class.getClassLoader()
                .setClassAssertionStatus(PathSpecBasedSchemaAnnotationVisitor.class.getName(), false);
    }

    @Autowired
    private DatahubUsageEventsApiController analyticsController;

    @Test
    public void initTest() {
        assertNotNull(analyticsController);
    }

    @Test
    public void analyticsControllerTest() {
        ResponseEntity<String> resp = analyticsController.raw("");
        assertEquals(resp.getStatusCode(), HttpStatus.OK);
    }
}
