package j10d207.tripeer.common;

import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;

public class ODsaySetting {

    @Value("{$odsay.list1}")
    private String list1;

    List<String> list = new ArrayList<String>();

    public ODsaySetting() {

    }
}
