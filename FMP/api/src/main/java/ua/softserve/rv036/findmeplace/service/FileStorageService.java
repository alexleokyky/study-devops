package ua.softserve.rv036.findmeplace.service;

import net.sf.jmimemagic.Magic;
import net.sf.jmimemagic.MagicMatch;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import ua.softserve.rv036.findmeplace.exception.FileNotFoundException;
import ua.softserve.rv036.findmeplace.exception.FileStorageException;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String location) {

        this.fileStorageLocation = Paths.get(location).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException e) {
            throw new FileStorageException("Can't create main directory for upload file", e);
        }
    }

    public String storeFile(MultipartFile file, String folder) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename())
                .replaceAll("\\s+", "-")
                .replaceAll("[^\\p{ASCII}]", "");
        fileName = UUID.randomUUID().toString() + fileName;
        folder = folder.replaceAll("\\.+/", "");

        try {
            Files.createDirectories(this.fileStorageLocation.resolve(folder).normalize());
        } catch (IOException e) {
            throw new FileStorageException("Can't create directory for upload file", e);
        }

        try {

            if (file.isEmpty()) {
                throw new FileStorageException("File is empty");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(
                        inputStream,
                        this.fileStorageLocation.resolve(folder).resolve(fileName),
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

        } catch (IOException e) {
            throw new FileStorageException("Can't store file: " + fileName + ". Try again", e);
        }

        return Paths.get("download/", folder, fileName).normalize().toString();
    }

    public Resource downloadFile(String filePath) {

        try {
            Path file = fileStorageLocation.resolve(filePath);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("Can't read file: " + filePath);
            }
        } catch (MalformedURLException e) {
            throw new FileNotFoundException("Can't read file: " + filePath, e);
        }
    }

    public boolean deleteFile(String filePath) {
        //git filePath = filePath.replace("download/", "");
        Path file = fileStorageLocation.resolve(filePath.replace("/download/", ""));
        try {
            Files.delete(file);
            return true;
        } catch (IOException e) {
            throw new FileNotFoundException("Can't find file: " + filePath, e);
        }
    }

    public static boolean isImage(MultipartFile file) {

        String[] imageExtensions = {"jpg", "png", "gif"};
        String extension = null;
        Magic magic = new Magic();

        try {
            MagicMatch match = magic.getMagicMatch(file.getBytes());
            extension = match.getExtension();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if(extension != null) {
            for(String imageExtension : imageExtensions) {
                if(extension.equals(imageExtension))
                    return true;
            }
        }

        return false;
    }

}