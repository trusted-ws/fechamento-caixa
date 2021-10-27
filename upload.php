<?php
//die('documents/' . '$pdfname');
if($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(!isset($_POST['sn'])) { die('Error!'); }
    if(!isset($_POST['passcode'])) { die('Password Error!'); }
    
    $passcode = "190607";
    $date = new DateTime();
    $date_str = $date->format('Y-m-d-H-i-s');
    $pdfname = $_POST['sn'] . $date_str . '.pdf';
    
    if(strcmp($_POST['passcode'], $passcode) != 0) {
        echo '1';
    } else {
        // Permission required: 'chmod 777 documents'
        move_uploaded_file(
            $_FILES['pdf']['tmp_name'],
            'documents/' . $pdfname
        );
        echo '0';
    }


} else {
    header('location:index.html');
    die();
}

?>  