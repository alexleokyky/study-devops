package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ua.softserve.rv036.findmeplace.exception.FileStorageException;
import ua.softserve.rv036.findmeplace.service.FileStorageService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/download/**")
    public ResponseEntity<Resource> fileDownload(HttpServletRequest request) {

        String pathToFile = request.getRequestURI().replace("/download/", "");
        Resource resource = fileStorageService.downloadFile(pathToFile);
        String contentType ;

        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            throw new FileStorageException("Could not determine file type.", e);
        }

        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
