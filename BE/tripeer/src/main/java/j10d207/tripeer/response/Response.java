package j10d207.tripeer.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class Response<D> {
    private final HttpStatus resultCode;
    private final String message;
    private final D data;
}