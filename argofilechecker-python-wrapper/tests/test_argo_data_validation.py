import os
from pathlib import Path
from urllib.parse import urlparse
import pytest
from ftplib import FTP

"""Validation tests on real floats data"""


@pytest.mark.parametrize ("float_number,dac_name", [("2903996","coriolis")])
def test_files_from_GDAC_should_be_accepted(float_number, dac_name, tmp_path):
    
    #first download relevant files in temp directory :
    ftp_url = os.getenv("GDAC_FTP_hostL", "ftp://ftp.ifremer.fr/ifremer/argo/dac")
    dest_folder = tmp_path / float_number
    dest_folder.mkdir()
    _download_relevant_files_from_GDAC_ftp(ftp_url, dac_name, float_number, dest_folder)
    
    print (os.listdir(dest_folder))

    


def _download_relevant_files_from_GDAC_ftp (ftp_url : str, dac_name : str, float_number : str, dest : Path) :
    """
    Download from a ftp server the different files (tech, meta, traj, profiles) for a specified dac and float number.

    Args :
        ftp_url (str) : root directory where dac directories are found
        dac_name (str) 
        float_number (str)
    """

    # prepare url
    float_ftp_url = f"{ftp_url}/{dac_name}/{float_number}"
    parsed_url = urlparse(float_ftp_url)
    hostname = parsed_url.hostname
    path = parsed_url.path
    #prepare files list to download :
    meta_tech_traj_files_list = [f'{float_number}_Rtraj.nc', f'{float_number}_tech.nc', f'{float_number}_meta.nc']
    # connect to ftp
    if hostname is not None :
        ftp = FTP(hostname)
        ftp.login()
        # go to the right folder : 
        ftp.cwd(path)
        # download meta, traj and tech files :
        _download_files_from_ftp(ftp,meta_tech_traj_files_list, dest )
        
        # dowload profiles files :
        ftp.cwd('profiles')
        profiles_files_names = ftp.nlst()
        _download_files_from_ftp(ftp, profiles_files_names, dest)
        ftp.quit()


def _download_files_from_ftp (ftp, files_names_list, dest) :
    """
    download a list of files to a dest directory from a FTP connexion.

    Args :
        ftp (FTP) : FTP object (ftplib) connected to the right directory
        files_names_list (List[str]) : list of file names present in the ftp directory
        dest (Path) : Path of the directory to download files
    """
    for file_name in files_names_list :
            if file_name  in ftp.nlst() :
                with open (dest/file_name, 'wb') as fp :
                    ftp.retrbinary(f'RETR {file_name}', fp.write)





