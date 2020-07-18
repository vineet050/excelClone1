const $ = require('jquery');
const electron = require('electron').remote;
const dialog = electron.dialog; 
const fs = require('fs').promises;

$(document).ready(function(){
    let rows=[];
    let lobj;
    function defaultCell(){
        let cell={
            val: '',
            font: '',
            fontSize: '',
            bold: false,
            italic: false,
            underline: false,
            bgcolor: '#FFFFFF',
            color: '#000000',
            valign: 'middle',
            halign: 'center',
            formula: '',
            upstream: [],
            downstream: []
        }
        return cell;
    }
    function preparecellDiv(cdiv, cell){
        $(cdiv).html(cell.val);
        $(cdiv).css('font-family',cell.font);
        $(cdiv).css('font-size', cell.fontSize+'px');
        $(cdiv).css('font-weight', cell.bold? 'bold':'normal');
        $(cdiv).css('font-style', cell.italic? 'italic':'normal');
        $(cdiv).css('text-decoration', cell.underline? 'underline':'none');
        $(cdiv).css('background-color', cell.bgcolor);
        $(cdiv).css('color', cell.color);
        $(cdiv).css('text-align', cell.halign);
    }

    $('.content').on('scroll', function(){
        $('#row1').css('top',$('.content').scrollTop());
        $('#col1').css('left',$('.content').scrollLeft());
        $('#first').css('left',$('.content').scrollLeft());
        $('#first').css('top',$('.content').scrollTop());
    });

    $('#new').on('click',function(){
        $('#grids').find('.row').each(function(){
            let cells=[];
            $(this).find('.cell').each(function(){
                let cell=defaultCell();
                preparecellDiv(this,cell);
                cells.push(cell);
            })
            rows.push(cells);
        })
        $('#home-menu').click();
    });

    $('#open').on('click',async function(){
        let dobj = await dialog.showOpenDialog();
        
        let data = await fs.readFile(dobj.filePaths[0]);
        rows= JSON.parse(data);
        let i=0;
        $('#grids').find('.row').each(function(){
            let j=0;
            $(this).find('.cell').each(function(){
                let cell=rows[i][j];
                preparecellDiv(this,cell);
                j++;
            })
            i++;
        })
    });

    $('#save').on('click',async function(){
        let dobj= await dialog.showSaveDialog();
        if(dobj.canceled){
            return;
        }else if(dobj.filePath===''){
            alert('Please select a file');
            return;
        }else{
            await fs.writeFile(dobj.filePath, JSON.stringify(rows));
            alert('Saved Sucessfully');
        }
        $('#home-menu').click();
    });

    $('.menu > div ').on('click', function(){
        $(this).removeClass('selected');
        $(this).addClass('selected');

        let menu = $(this).attr('data-content');
        $('#menu-content-container > div').css('display', 'none');
        $('#'+menu).css('display','flex');
    })

    $('#font-family').on('change', function(){
        let font = $(this).val();
        $('#grids .cell.selected').each(function(){
            $(this).css('font-family', font);
            let rid=parseInt($(this).attr('rid'),10);
            let cid=parseInt($(this).attr('cid'),10);
            let cobj=rows[rid][cid];
            cobj.font=font;
        })
    })

    $('#font-size').on('change', function(){
        let size = $(this).val();
        $('#grids .cell.selected').each(function(){
            $(this).css('font-size', size+'px');
            let rid=parseInt($(this).attr('rid'),10);
            let cid=parseInt($(this).attr('cid'),10);
            let cobj=rows[rid][cid];
            cobj.fontSize=size;
        })
    })

    $('#bold').on('click',function(){
        $(this).toggleClass('selected');
        let b = $(this).hasClass('selected');
        $('#grids .cell.selected').each(function(){
            $(this).css('font-weight', b? 'bold':'normal');
            let rid=parseInt($(this).attr('rid'),10);
            let cid=parseInt($(this).attr('cid'),10);
            let cobj=rows[rid][cid];
            cobj.bold=b;
        })
    })
    $('#italic').on('click',function(){
        $(this).toggleClass('selected');
        let i = $(this).hasClass('selected');
        $('#grids .cell.selected').each(function(){
            $(this).css('font-style', i? 'italic':'normal');
            let rid=parseInt($(this).attr('rid'));
            let cid=parseInt($(this).attr('cid'));
            let cobj=rows[rid][cid];
            cobj.italic=i;
        })
    })
    $('#underline').on('click',function(){
        $(this).toggleClass('selected');
        let u = $(this).hasClass('selected');
        $('#grids .cell.selected').each(function(){
            $(this).css('text-decoration', u? 'underline':'none');
            let rid=parseInt($(this).attr('rid'));
            let cid=parseInt($(this).attr('cid'));
            let cobj=rows[rid][cid];
            cobj.underline=u;
        })
    })
    $('#bgcolor').on('click',function(){
        let color = $(this).val();
        $('#grids .cell.selected').each(function(){
            $(this).css('background-color', color);
            let rid=parseInt($(this).attr('rid'));
            let cid=parseInt($(this).attr('cid'));
            let cobj=rows[rid][cid];
            cobj.bgcolor=color;
        })
    })
    $('#fgccolor').on('click',function(){
        let color = $(this).val();
        $('#grids .cell.selected').each(function(){
            $(this).css('color', color);
            let rid=parseInt($(this).attr('rid'));
            let cid=parseInt($(this).attr('cid'));
            let cobj=rows[rid][cid];
            cobj.color=color;
        })
    })

    $('.valign').on('click',function(){
        $('.valign').removeClass('selected');
        $(this).addClass('selected');
    })
    $('.halign').on('click',function(){
        $('.halign').removeClass('selected');
        $(this).addClass('selected');
    })

    $('#grids .cell').on('click', function(e){
        lobj=this;
        if(e.ctrlKey){
            $(this).addClass('selected');
        }else{
            $('#grids .cell').removeClass('selected');
            $(this).addClass('selected');
        }
        let rid=parseInt($(this).attr('rid'),10);
        let cid=parseInt($(this).attr('cid'),10);
        let cobj=rows[rid][cid];
        $('#font-family').val(cobj.font);
        $('#font-size').val(cobj.fontSize);
        if(cobj.bold){
            $('#bold').addClass('selected');
        }else{
            $('#bold').removeClass('selected');
        }
        if(cobj.italic){
            $('#italic').addClass('selected');
        }else{
            $('#italic').removeClass('selected');
        }
        if(cobj.underline){
            $('#underline').addClass('selected');
        }else{
            $('#underline').removeClass('selected');
        }
        $('#bgcolor').val(cobj.bgcolor);
        $('#fgccolor').val(cobj.color);

        $('#textf').val(String.fromCharCode(cid+65)+(rid+1));
        $('#formula1').val(cobj.formula);
    })

    $('#grids .cell').on('keyup', function(e){
        let rid=parseInt($(this).attr('rid'),10);
        let cid=parseInt($(this).attr('cid'),10);
        let cobj=rows[rid][cid];

        if(cobj.formula){
            cobj.formula='';
            //delete upstream
            for(let i=0;i<cobj.upstream.length;i++){
                let upo=cobj.upstream[i];
                let fupo=rows[upo.rid][upo.cid];
                for(let j=0;j<fupo.downstream.length;j++){
                    let temp = fupo.downstream[j];
                    if(temp.rid==rid && temp.cid==cid){
                        fupo.downstream.splice(j,1);
                        break;
                    }
                }
            }
            cobj.upstream=[];
        }

        cobj.val=$(this).html();

        for(let i=0;i<cobj.downstream.length;i++){
            let dpo=cobj.downstream[i];
            updateDs();
        }
    });

    $('#formula1').on('blur',function(){
        if(lobj.formula){
            lobj.formula='';
            //delete upstream
            for(let i=0;i<lobj.upstream.length;i++){
                let upo=lobj.upstream[i];
                let fupo=rows[upo.rid][upo.cid];
                for(let j=0;j<fupo.downstream.length;j++){
                    let temp = fupo.downstream[j];
                    if(temp.rid==rid && temp.cid==cid){
                        fupo.downstream.splice(j,1);
                        break;
                    }
                }
            }
            lobj.upstream=[];
        }

        lobj.formula=$(this).val();
    })

    $('#new').click();
})

