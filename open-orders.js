function loadSummary(tab, order_numbers = null, filter_data = null, calendar_data = null) {
    start_date = $('input[name="start_date_report"]').val();
    end_date = $('input[name="end_date_report"]').val();

    Pace.restart();
    Pace.start();

    if ($('input[name="start_date_report"]').val() == '') {
        $('#summary_date_range').hide();
        var order_by_day_url = '/api/v1/order/open-orders-by-day-total-summary-report?limit=1000';
        var order_by_facility_url = '/api/v1/order/open-orders-by-facility-total-summary-report?limit=1000';
        var order_url = '/api/v1/order/open-orders-total-summary-report?limit=1000';
        var order_by_items_url = '/api/v1/order/open-orders-by-item-total-summary-report?limit=1000';
        var back_order_url = '/api/v1/order/open-orders-by-backorder-summary-report';
        var open_rush_url = '/api/v1/order/open-orders-total-summary-report?limit=1000&rush=1';
        var company_url = '/api/v1/order/open-orders-by-company-summary-report'
        var item_agg_url = '/api/v1/order/open-orders-by-item-agg-report-summary'

    } else {
        $('#summary_date_range').hide();
        $('.summary_date_range').html(start_date + ' thru ' + end_date);
        start_date = Date.parse(start_date).toISOString().slice(0, -14);
        end_date = Date.parse(end_date).toISOString().slice(0, -14);

        $('#summary_date_range').show();
        $('#summary_date_range').html(start_date + ' thru ' + end_date);
        var order_by_day_url = '/api/v1/order/open-orders-by-day-total-summary-report?&start_date=' + start_date +
            '&end_date=' + end_date;
        var order_by_facility_url = '/api/v1/order/open-orders-by-facility-total-summary-report?&start_date=' + start_date +
            '&end_date=' + end_date;
        var order_url = '/api/v1/order/open-orders-total-summary-report?&start_date=' + start_date +
            '&end_date=' + end_date;
        var order_by_items_url = '/api/v1/order/open-orders-by-item-total-summary-report?start_date=' +
            start_date + '&end_date=' + end_date;
        var back_order_url = '/api/v1/order/open-orders-by-backorder-summary-report?start_date=' +
            start_date + '&end_date=' + end_date;
        var open_rush_url = '/api/v1/order/open-orders-total-summary-report?&start_date=' + start_date +
            '&end_date=' + end_date + '&rush=1';
        var company_url = '/api/v1/order/open-orders-by-company-summary-report?start_date=' +
            start_date + '&end_date=' + end_date;
        var item_agg_url = '/api/v1/order/open-orders-by-item-agg-report-summary'
    }

    if (tab == 'day') {
        $.ajax({
            url: order_by_day_url,
            success: function(response) {
                Pace.stop();

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qty = 0;
                /** @type {Number} */
                var cost = 0.0;
                /** @type {Number} */

                totalOrders = response.total_orders;
                qty = (response.qty_ordered - (response.qty_shipped + response.qty_canceled));
                cost = parseFloat(response.cost);

                $('#openOrders_orders_day').html(totalOrders).digits();
                $('#openOrders_units_day').html(qty).digits();
                $('#openOrders_cost_day').html(cost).currency();
            }
        });
    }

    if (tab == 'facility') {
        $.ajax({
            url: order_by_facility_url,
            success: function(response) {
                Pace.stop();

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qty = 0;
                /** @type {Number} */
                var subtotal = 0.0;
                /** @type {Number} */
                var cost = 0.0;
                /** @type {Number} */

                totalOrders = response.total_orders;
                qty = (response.qty_ordered - (response.qty_shipped + response.qty_canceled));
                cost = parseFloat(response.cost);

                $('#openOrders_orders_facility').html(totalOrders).digits();
                $('#openOrders_units_facility').html(qty).digits();
                $('#openOrders_cost_facility').html(cost).currency();
            }
        });
    }

    if (tab == 'order') {
        var _url = order_url;
        if (order_numbers !== null) {
            _url += '&order_numbers=' + btoa(order_numbers);
        }
        if (calendar_data !== null) {
            _url += '&b2b_date=' + calendar_data['date']
                 + '&type=' + calendar_data['type']
                 + '&company=' + btoa(calendar_data['company']);
        }
        $.ajax({
            url: _url,
            success: function(response) {
                Pace.stop();

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qty = 0;
                /** @type {Number} */
                var cost = 0.0;
                /** @type {Number} */

                totalOrders = response.total_orders;
                qty = (response.qty_ordered - (response.qty_shipped + response.qty_canceled));
                cost = parseFloat(response.cost);

                $('#openOrders_orders').html(totalOrders).digits();
                $('#openOrders_units').html(qty).digits();
                $('#openOrders_cost').html(cost).currency();
            }
        });
    }

    if (tab == 'item') {
        $.ajax({
            url: order_by_items_url,
            success: function(response) {
                Pace.stop();

                /** @type {Number} */
                var qtyOrdered = 0;
                /** @type {Number} */
                var qtyAllocated = 0;
                /** @type {Number} */
                var qtyShipped = 0;
                /** @type {Number} */
                var qtyAvailable = 0;
                /** @type {Number} */
                var qtyInbound = 0;
                /** @type {Number} */

                qtyOrdered = response.qty_ordered;
                qtyAllocated = response.qty_allocated;
                qtyShipped = response.qty_shipped;
                qtyAvailable = response.available_quantity;
                qtyInbound = response.inbound_quantity;

                $('#openOrdersByItem_ordered').html(qtyOrdered).digits();
                $('#openOrdersByItem_allocated').html(qtyAllocated).digits();
                $('#openOrdersByItem_shipped').html(qtyShipped).digits();
                $('#openOrdersByItem_available').html(qtyAvailable).digits();
                $('#openOrdersByItem_inbound').html(qtyInbound).digits();
            }
        });
    }

    if (tab == 'backorder') {
        $.ajax({
            url: back_order_url,
            success: function(response) {
                Pace.stop();
                if (0 === response.count) {
                    $('#openOrdersBackorders_orders').html(0).digits();
                    $('#openOrdersBackorders_qty_ordered').html(0).digits();
                    $('#openOrdersBackorders_qty_backordered').html(0).digits();
                    return;
                }

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qtyOrdered = 0;
                /** @type {Number} */
                var qtyBackOrdered = 0;
                /** @type {Number} */

                totalOrders = response.results[0].total_orders
                qtyOrdered = response.results[0].qty_ordered
                qtyBackOrdered = response.results[0].qty_backordered

                $('#openOrdersBackorders_orders').html(totalOrders).digits();
                $('#openOrdersBackorders_qty_ordered').html(qtyOrdered).digits();
                $('#openOrdersBackorders_qty_backordered').html(qtyBackOrdered).digits();
            }
        });
    }

    if (tab == 'rush') {
        $.ajax({
            url: open_rush_url,
            success: function(response) {
                Pace.stop();

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qty = 0;
                /** @type {Number} */
                var cost = 0.0;
                /** @type {Number} */

                totalOrders = response.total_orders;
                qty = (response.qty_ordered - (response.qty_shipped + response.qty_canceled));
                cost = parseFloat(response.cost);

                $('#openOrdersRush_orders').html(totalOrders).digits();
                $('#openOrdersRush_units').html(qty).digits();
                $('#openOrdersRush_cost').html(cost).currency();
            }
        });
    }

    if (tab == 'company') {
        $.ajax({
            url: company_url,
            success: function(response) {
                Pace.stop();
                if (0 === response.count) {
                    $('#openOrdersCompany_orders').html(0).digits();
                    $('#openOrdersCompany_units').html(0).digits();
                    $('#openOrdersCompany_merch').html(0).digits();
                    return;
                }

                /** @type {Number} */
                var totalOrders = 0;
                /** @type {Number} */
                var qtyOrdered = 0;
                /** @type {Number} */
                var merchandise = 0;
                /** @type {Number} */

                totalOrders = response.results[0].total_orders
                qtyOrdered = response.results[0].qty_ordered
                qtyCanceled = response.results[0].qty_canceled
                qtyShipped= response.results[0].qty_shipped
                merchandise = response.results[0].merchandise

                $('#openOrdersCompany_orders').html(totalOrders).digits();
                $('#openOrdersCompany_units').html(qtyOrdered - qtyCanceled - qtyShipped).digits();
                $('#openOrdersCompany_merch').html(merchandise).digits();
            }
        });
    }

    if (tab == 'item_agg') {
        var data = {}
        if (filter_data !== null) {
            data['filter_data'] = filter_data
        }
        $.ajax({
            url: item_agg_url,
            data: data,
            success: function(response) {
                Pace.stop();
                if (0 === response.count) {
                    $('#openOrdersByItemAgg_ordered').html(0).digits();
                    return;
                }

                qtyAvailable = response.results[0].qty_available
                qtyOrdered = response.results[0].qty_ordered
                qtyNew = response.results[0].qty_new
                qtyPrinted = response.results[0].qty_printed
                qtyShipped = response.results[0].qty_shipped

                $('#openOrdersByItemAgg_available').html(qtyAvailable).digits();
                $('#openOrdersByItemAgg_ordered').html(qtyOrdered).digits();
                $('#openOrdersByItemAgg_new').html(qtyNew).digits();
                $('#openOrdersByItemAgg_printed').html(qtyPrinted).digits();
                $('#openOrdersByItemAgg_shipped').html(qtyShipped).digits();
            }
        });
    }
}

function handleData(d) {
    d.format = 'datatables';

    if (typeof d.search !== 'undefined') {
        d.search = d.search.value;
    }

    // Date range input for reports
    if ($('input[name="start_date_report"]') && $('input[name="start_date_report"]').val() &&
        $('input[name="end_date_report"]')) {
        d.start_date = Date.parse($('input[name="start_date_report"]').val()).toString('yyyy-MM-dd');
        d.end_date = Date.parse($('input[name="end_date_report"]').val()).toString('yyyy-MM-dd');
    }

    d.search_fields = [];
    d.column_fields = [];

    var columns = d.columns;

    for (var i = 0; i < columns.length; i++) {
        var search_field = (typeof columns[i].search_field == 'undefined') ?
            columns[i].data :
            columns[i].search_field;
        d.search_fields.push(search_field);
        d.column_fields.push(columns[i].data);
    }

    //pass what API is expecting for limit/offset
    d.limit = d.length;
    d.offset = d.start;
}

function getButtons() {
    return [{
        extend: 'csv'
    }, create_subscription_datatable_button]
}

let calendar_comments = [];
function showCalendar() {
    calendar_comments = [];
    $('#b2b-calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'basicWeek'
        },
        defaultView: 'basicWeek',
        navLinks: true,
        height: parseInt($('#page-wrapper').innerHeight() * 0.75),
        eventLimit: false,
        events: {
            url: '/order/b2b-schedule-calendar-data',
            error: function() {
                toastr.error('Failed to load calendar, please try again')
            }
        },
        eventRender: function(event, element) {
            var details = event.extendedProps.details, color, background, border;
            var type, date, company, sources, sources_split, total_picks, waved_picks, open, on_hold, in_picking, triage, in_exception, pick_complete, inducted, pack_complete,
                waved_date, wave_number, batched_picks, batched_units, comments, event_comments,
                total_sources = [], total_total_picks = 0, total_waved_picks = 0, total_waved_units = 0, total_batched_picks = 0, total_batched_units = 0, 
                total_open = 0, total_on_hold = 0, total_in_picking = 0, total_triage = 0, total_in_exception = 0, total_pick_complete = 0, total_kitting = 0, total_inducted = 0, total_pack_complete = 0;
            for (var i = 0; i < details.length; i++){
                event_comments = [];
                comments = '';
                if (details[i].comments.length > 0) {
                    for (let comment of details[i].comments) {
                        calendar_comments.push(comment);
                        event_comments.push(calendar_comments.length-1);
                    }
                    comments = event_comments.join(',');
                }
                color = "#333333"; // default colors
                background = "#FFFFFF";
                border = "1px solid #333333";
                message = '';
                if (details[i]['type'] == 'pack_date' && details[i]['picks_waved'] >= details[i]['total_picks']) {
                    color = "#FFFFFF";
                    background = "#0587e2";
                    border = "1px solid #0587e2";
                    message = " | <b>WAVED</b>";
                }
                if (details[i]['type'] == 'pack_date' && details[i]['all_packed'] == true) {
                    color = "#999999";
                    background = "#333333";
                    border = "1px solid #333333";
                    message = " | <b>PACKED</b>";
                }
                if (details[i]['type'] == 'route_date') {
                    if (details[i]['all_routed'] == 0) {
                        color = "#999999";
                        background = "#333333";
                        border = "1px solid #333333";
                        message = " | <b>ROUTED</b>";
                    }
                    if (details[i]['all_routed'] == 1) {
                        color = "#FFFFFF";
                        background = "#ED0000";
                        border = "1px solid #ED0000";
                        message = ' | <i class="fa fa-exclamation-triangle" style="color: #FFFF00"></i>';
                    }
                }
                if (details[i]['type'] == 'ship_date') {
                    if (details[i]['all_shipped'] == 0) {
                        color = "#999999";
                        background = "#333333";
                        border = "1px solid #333333";
                        message = ' | <b>SHIPPED</b>';
                    }
                    if (details[i]['all_shipped'] == 1) {
                        color = "#FFFFFF";
                        background = "#ED0000";
                        border = "1px solid #ED0000";
                        message = ' | <i class="fa fa-exclamation-triangle" style="color: #FFFF00"></i>';
                    }
                }
                type = details[i]['type'];
                date = details[i]['start'];
                company = details[i]['company'];
                sources = details[i]['sources'];
                sources_split = sources.split(',');
                total_picks = details[i]['total_picks'];
                waved_date = details[i]['waved_date'] ? moment(details[i]['waved_date']).format('MM/DD/YYYY') : '';
                wave_number = details[i]['wave_number'] ? details[i]['wave_number'] : '';
                waved_picks = details[i]['picks_waved'];
                waved_units = details[i]['waved_units'];
                batched_picks = details[i]['batched_picks'];
                batched_units = details[i]['batched_units'];
                open = details[i]['open_units'];
                on_hold = details[i]['on_hold_units'];
                in_picking = details[i]['in_picking_units'];
                triage = details[i]['triage_units'];
                in_exception = details[i]['in_exception_units'];
                pick_complete = details[i]['pick_complete_units'];
                kitting = details[i]['kitting_units'];
                inducted = details[i]['inducted_units'];
                pack_complete = details[i]['pack_complete_units'];
                for (var j in sources_split) {
                    if (!total_sources.includes(sources_split[j])) {
                        total_sources.push(sources_split[j]);
                    }
                }
                total_total_picks += total_picks;
                total_open += open; 
                total_waved_picks += waved_picks;
                total_waved_units += waved_units;
                total_batched_picks += batched_picks;
                total_batched_units += batched_units;
                total_on_hold += on_hold; 
                total_in_picking += in_picking; 
                total_triage += triage; 
                total_in_exception += in_exception;
                total_pick_complete += pick_complete;
                total_kitting += kitting;
                total_inducted += inducted;
                total_pack_complete += pack_complete;

                var popup_data = ' data-company="' + company + '" '
                                + 'data-sources="'+ sources +'" data-total-picks="'+ total_picks + '" data-open-units="'+ open +'" '
                                + 'data-waved-date="'+ waved_date +'" data-wave-number="'+ wave_number + '" '
                                + 'data-waved-picks="'+waved_picks+'" data-waved-units="'+ waved_units +'" data-batched-picks="'+ batched_picks +'" '
                                + 'data-batched-units="'+ batched_units +'" data-on-hold="'+ on_hold +'" data-in-picking="'+ in_picking +'" '
                                + 'data-triage="'+ triage +'" data-in-exception="'+ in_exception +'" data-pick-complete="'+ pick_complete +'" '
                                + 'data-kitting="'+ kitting + '" data-inducted="'+ inducted + '" data-pack-complete="' + pack_complete +'" data-comments="'+ comments +'" '
                                + 'data-date="'+date+'" data-schedule-type="'+event.title.toLowerCase()+'" ';
                var detail_content = '';
                detail_content += '<div class="detail-span img-rounded" style="margin-top: 3px; padding: 2px 6px; color: ' + color + '; background-color: ' + background + '; border: '+ border +';">'
                    + '<a class="detail-txt" name="detail-link" href="#" data-type="'+ type +'" data-date="'+ date +'" data-company="'+ company +'" style="padding: 0; color: inherit; background-color: transparent;"><b>' 
                    + (sources_split.length > 1 ? 'MULTIPLE' : sources) + ': '+ company + '</b></a><br/>'
                    + '<a title="Show Details" class="popup-details"' + popup_data + 'style="padding: 0; color: inherit; background-color: transparent;">'
                    + '<i class="fa fa-shopping-cart"></i> '+ details[i].orders + ' | '
                    + '<i class="fa fa-cubes"></i> '+ details[i].units + ' | '
                    + '<i class="fa fa-usd"></i> ' + details[i].total + message + "</a></div>";
                element.find('.fc-content').append(detail_content);

                // Ensure click event is only triggered once
                $('a[name="detail-link"]', element).off('click');
                $('a[name="detail-link"]', element).click(function() {
                    var calendar_data = {}
                    calendar_data['type'] = $(this).data('type')
                    calendar_data['date'] = $(this).data('date')
                    calendar_data['company'] = $(this).data('company')
                    calendar_data_string = JSON.stringify(calendar_data)
                    $('.nav-tabs li:eq(2) a').tab('show');
                    showOrdersSummaryTable(null, calendar_data_string);
                    loadSummary('order', null, null, calendar_data)
                })
            }
            var popup_data = ' data-company="TOTAL" '
                           + 'data-sources="'+ total_sources.join(', ') +'" data-total-picks="'+ total_total_picks + '" data-open-units="'+ total_open +'" '
                           + 'data-waved-picks="'+total_waved_picks+'" data-waved-units="'+ total_waved_units +'" data-batched-picks="'+ total_batched_picks +'" '
                           + 'data-batched-units="'+ total_batched_units +'" data-on-hold="'+ total_on_hold +'" data-in-picking="'+ total_in_picking +'" '
                           + 'data-triage="'+ total_triage +'" data-in-exception="'+ total_in_exception +'" data-pick-complete="'+ total_pick_complete +'" '
                           + 'data-kitting="'+ total_kitting +'" data-inducted="'+ total_inducted + '" data-pack-complete="' + total_pack_complete +'" ';
            var section_summary = '<div style="margin-top: 10px; padding: 2px 6px; color: #FFFFFF; background-color: '+ event.borderColor + '; border: 0;">'
                                + '<b>TOTAL '+event.title.toUpperCase()+'</b><br/>'
                                + '<a title="Show Details" class="popup-details"' + popup_data + 'style="padding: 0; color: inherit; background-color: transparent;">'
                                + '<i class="fa fa-shopping-cart"></i> '+ event.extendedProps.orders_total + ' | '
                                + '<i class="fa fa-cubes"></i> '+ event.units + ' | '
                                + '<i class="fa fa-usd"></i> ' + event.extendedProps.amount_total + "</a></div>";
            element.append(section_summary);
            element.find('.fc-title').css('color', event.borderColor);
        },
        eventClick: function(calEvent, jsEvent, view) {
            // Make calendar events unclickable
            if (calEvent.url){
                return false;
            }
        },
    });

    $('#refresh-b2b-calendar').click(function(){
        $('#b2b-calendar').fullCalendar('refetchEvents')
    })
}

$(document).on('click', '.popup-details', function() {
    var company = $(this).data('company'),
        date = $(this).data('date'),
        schedule_type = $(this).data('schedule-type'),
        position = $(this).offset(),
        sources = $(this).data('sources'),
        total_picks = $(this).data('total-picks'),
        open_units = $(this).data('open-units'),
        waved_date = $(this).data('waved-date'),
        wave_number = $(this).data('wave-number'),
        waved_picks = $(this).data('waved-picks'),
        waved_units = $(this).data('waved-units'),
        batched_picks = $(this).data('batched-picks'),
        batched_units = $(this).data('batched-units'),
        on_hold = $(this).data('on-hold'),
        in_picking = $(this).data('in-picking'),
        triage = $(this).data('triage'),
        in_exception = $(this).data('in-exception'),
        pick_complete = $(this).data('pick-complete'),
        kitting = $(this).data('kitting'),
        inducted = $(this).data('inducted'),
        pack_complete = $(this).data('pack-complete'),
        comments = $(this).data('comments'),
        popup_box;
        var prev_comments = '';
        if (comments && comments != '') {
            comments = comments.toString().split(',');
            if (comments.length > 0) {
                for (var i in comments) {
                    var idx = parseInt(comments[i]);
                    comment = calendar_comments[idx].comment.replace(/\n/g, "<br />");
                    prev_comments += '<div class="img-rounded" style="border: 1px solid #AAAAAA; background-color: #FFFFFF; padding: 3px 6px; margin-left: 0; margin-bottom: 3px;">'
                                   + '<div>'+comment+'</div>'
                                   + '<div class="text-right" style="font-size: 7pt;"><b>'+calendar_comments[idx].username+'</b> at <b>'+moment(calendar_comments[idx].created_at).format('MM/DD/YYYY HH:mm:ss')+'</b></div>'
                                   + '</div>';
                }
            }
        }
    $('.popup-box').remove();
    if (company == 'TOTAL') {
        popup_box = '<div class="popup-box" style="resize: both; overflow: auto; padding: 15px; border: 1px solid #666; position: absolute; z-index: 2000; background-color: #FFF; width: 600px; left: ' + position.left +'px; top: ' + position.top + 'px;">'
                  + '<div class="pull-left"><div class="btn btn-sm btn-default move-popup" style="cursor: move;"><span class="fa fa-arrows"></span></div></div><div class="text-right"><div class="btn btn-sm btn-default close-popup"><span class="fa fa-times"></span></div></div>'
                  + '<h3 style="font-weight: 800;">' + company + '</h3>'
                  + '<table class="table table-striped table-condensed">'
                  + '<tr><td style="font-weight: 800;">Sources</td><td class="text-right">'+sources+'</td><td>&nbsp;</td><td style="font-weight: 800;">On Hold Units</td><td class="text-right">'+on_hold+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Total Picks</td><td class="text-right">'+total_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Picking</td><td class="text-right">'+in_picking+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Open Units</td><td class="text-right">'+open_units+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Exception</td><td class="text-right">'+in_exception+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Waved Picks</td><td class="text-right">'+waved_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Triage</td><td class="text-right">'+triage+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Waved Units</td><td class="text-right">'+waved_units+'</td><td>&nbsp;</td><td style="font-weight: 800;">Pick Complete</td><td class="text-right">'+pick_complete+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Batched Picks</td><td class="text-right">'+batched_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">Kitting</td><td class="text-right">'+kitting+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Batched Units</td><td class="text-right">'+batched_units+'</td><td>&nbsp;</td><td style="font-weight: 800;">Inducted</td><td class="text-right">'+inducted+'</td></tr>'
                  + '<tr><td colspan=3>&nbsp;</td><td style="font-weight: 800;">Pack Complete</td><td class="text-right">'+pack_complete+'</td><td colspan=3>&nbsp;</td></tr>'
                  + '</table>';
    } else {
        popup_box = '<div class="popup-box" style="resize: both; overflow: auto; padding: 15px; border: 1px solid #666; position: absolute; z-index: 2000; background-color: #FFF; width: 600px; left: ' + position.left +'px; top: ' + position.top + 'px;">'
                  + '<div class="pull-left"><div class="btn btn-sm btn-default move-popup" style="cursor: move;"><span class="fa fa-arrows"></span></div></div><div class="text-right"><div class="btn btn-sm btn-default close-popup"><span class="fa fa-times"></span></div></div>'
                  + '<h3 style="font-weight: 800;">' + company + '</h3>'
                  + '<table class="table table-striped table-condensed">'
                  + '<tr><td style="font-weight: 800;">Sources</td><td class="text-right">'+sources+'</td><td>&nbsp;</td><td style="font-weight: 800;">On Hold Units</td><td class="text-right">'+on_hold+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Total Picks</td><td class="text-right">'+total_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Picking</td><td class="text-right">'+in_picking+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Open Units</td><td class="text-right">'+open_units+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Exception</td><td class="text-right">'+in_exception+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Waved on Date</td><td class="text-right">'+waved_date+'</td><td>&nbsp;</td><td style="font-weight: 800;">In Triage</td><td class="text-right">'+triage+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Wave Number</td><td class="text-right">'+wave_number+'</td><td>&nbsp;</td><td style="font-weight: 800;">Pick Complete</td><td class="text-right">'+pick_complete+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Waved Picks</td><td class="text-right">'+waved_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">Kitting</td><td class="text-right">'+kitting+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Waved Units</td><td class="text-right">'+waved_units+'</td><td>&nbsp;</td><td style="font-weight: 800;">Inducted</td><td class="text-right">'+inducted+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Batched Picks</td><td class="text-right">'+batched_picks+'</td><td>&nbsp;</td><td style="font-weight: 800;">Pack Complete</td><td class="text-right">'+pack_complete+'</td></tr>'
                  + '<tr><td style="font-weight: 800;">Batched Units</td><td class="text-right">'+batched_units+'</td><td colspan=3>&nbsp;</td></tr>'
                  + '<tr><td colspan=5>'
                  + '<div class="prev-comments">'+prev_comments+'</div>'
                  + '<textarea data-company="'+company+'" data-date="'+date+'" data-schedule-type="'+schedule_type+'" class="form-control" style="width: 100%;" rows=3></textarea>'
                  + '<div style="margin-top: 5px;" class="btn btn-xs btn-primary pull-right add-comment">Add Comment</div><div style="margin-top: 5px;" class="text-center">Comments cannot be edited or deleted.</div>'
                  + '</td></tr></table></div>';
    }
    $("BODY").append(popup_box);
});
$(document).on('click', '.close-popup', function() {
    $('.popup-box').remove();
});
var mouseX, mouseY, popupX, popupY;
$(document).on('mousedown', '.move-popup', function(e) {
    e = e || window.event;
    e.preventDefault();
    mouseX = e.pageX;
    mouseY = e.pageY;
    var offset = $(".popup-box:visible").offset();
    popupX = offset.left;
    popupY = offset.top;
    $(document).on('mousemove.movepopup', function(e) {
        e = e || window.event;
        e.preventDefault();
        var diffX = mouseX - e.pageX;
        var diffY = mouseY - e.pageY;
        $(".popup-box:visible").offset({ top: popupY - diffY, left: popupX - diffX});
        mouseX = e.pageX;
        mouseY = e.pageY;
        var offset = $(".popup-box:visible").offset();
        popupX = offset.left;
        popupY = offset.top;
    });
});
$(document).on('mouseup', '.move-popup', function(e) {
    $(document).off('mousemove.movepopup');
});
$(document).on('click', '.add-comment', function() {
    var parent = $(this).parent();
    var div = parent.find("TEXTAREA");
    var payload = {
        'comment': div.val(),
        'company': div.data('company'),
        'schedule_type': div.data('schedule-type'),
        'schedule_date': moment(div.data('date')).format("YYYY-MM-DD")
    };
    $.ajax({
        method: "POST",
        url: "/api/v1/order/calendar-comment",
        contentType: "application/json",
        data: JSON.stringify(payload),
        dataType: "json",
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success: function(res) {
            var new_comment = '<div class="img-rounded" style="border: 1px solid #AAAAAA; background-color: #FFFFFF; padding: 3px 6px; margin-left: 0; margin-bottom: 3px;">'
                            + '<div>'+res.comment.replace(/\n/g, "<br />")+'</div>'
                            + '<div class="text-right" style="font-size: 7pt;"><b>'+res.username+'</b> at <b>'+moment(res.created_at).format('MM/DD/YYYY HH:mm:ss')+'</b></div>'
                            + '</div>';
            parent.find(".prev-comments").append(new_comment);
            div.val('');
            var comment_idx = calendar_comments.length;
            var pd = $('.popup-details[data-company="'+res.company+'"][data-date="'+res.schedule_date+'"][data-schedule-type="'+res.schedule_type+'"]');
            var pdc = pd.data('comments');
            pdc = pdc == '' ? comment_idx : pdc + ',' + comment_idx;
            pd.data('comments', pdc);
            calendar_comments.push(res);

            toastr_success_wrapper('Comment added.');
        },
        error: function(response) {
            toastr.error(response.responseJSON.error, "Unable to add comment");
        }
    });

})

function showOrdersDaySummaryTable() {
    if (typeof open_orders_day_detail_table != 'undefined') {
        $('#open-orders-day-table').DataTable().destroy();
        $('#open-orders-day-table').empty();
    }

    open_orders_day_detail_table = $('#open-orders-day-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-by-day-summary-report',
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                render: function(value) {
                    return '<a onclick="javascript:showOrdersDrilldownTableByDate(\'' + value + '\', \'open-orders-day-table\')">' + value + '</a>';
                },
                title: 'Order Date'
            },
            {
                data: 'total_orders',
                title: 'Total Orders'
            },
            {
                data: 'total_holds',
                title: 'Total Holds'
            },
            {
                data: 'cost',
                title: 'Cost'
            },
            {
                data: 'subtotal',
                title: 'Subtotal'
            },
            {
                data: 'discount',
                title: 'Discount'
            },
            {
                data: 'tax',
                title: 'Tax'
            },
            {
                data: 'shipping_cost',
                title: 'Shipping'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-orders-day-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showOrdersFacilitySummaryTable() {

    if (typeof open_orders_facility_detail_table != 'undefined') {
        $('#open-orders-table').DataTable().destroy();
        $('#open-orders-table').empty();
    }

    open_orders_facility_detail_table = $('#open-orders-facility-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-by-facility-summary-report',
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date'
            },
            {
                data: 'facility_code',
                title: 'Facility Code'
            },
            {
                data: 'total_orders',
                title: 'Total Orders'
            },
            {
                data: 'total_holds',
                title: 'Total Holds'
            },
            {
                data: 'cost',
                title: 'Cost'
            },
            {
                data: 'subtotal',
                title: 'Subtotal'
            },
            {
                data: 'discount',
                title: 'Discount'
            },
            {
                data: 'tax',
                title: 'Tax'
            },
            {
                data: 'shipping_cost',
                title: 'Shipping'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-orders-facility-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showOrdersSummaryTable(filter_data = null, calendar_data = null) {
    if (typeof open_orders_detail_table != 'undefined') {
        $('#open-orders-table').DataTable().destroy();
        $('#open-orders-table').empty();
    }

    var url = '/api/v1/order/open-orders-detail-report';

    // filter_data and calendar_data shall be mutually exclusive
    if (filter_data !== null) {
        url = url + '?filter_data=' + btoa(filter_data);
    }
    else if (calendar_data !== null) {
        url = url + '?calendar_data=' + btoa(calendar_data)
    }
    else {
        // Do nothing
    }
    open_orders_detail_table = $('#open-orders-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: url,
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date'
            },
            {
                data: 'order_number',
                title: 'Order Number',
                render: function(value) {
                    return '<a href="/order/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'business_type',
                title: 'Business Type'
            },
            {
                data: 'company',
                title: 'Company'
            },
            {
                data: 'facility_code',
                title: 'Facility Code'
            },
            {
                data: 'po_number',
                title: "PO Number"
            },
            {
                data: 'cancel_date',
                title: 'Cancel Date'
            },
            {
                data: 'cost',
                title: 'Cost'
            },
            {
                data: 'subtotal',
                title: 'Subtotal'
            },
            {
                data: 'discount',
                title: 'Discount'
            },
            {
                data: 'tax',
                title: 'Tax'
            },
            {
                data: 'shipping_cost',
                title: 'Shipping'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_packed',
                title: 'Packed'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            $("#open-orders-table").DataTable().rows().every(function(index, tableLoop, rowLoop) {
                var data = this.data();
                if (data.qty_ordered - (data.qty_canceled + data.qty_backordered + data.qty_shipped + data.pack_complete) <= 0) {
                    this.nodes().to$().find('TD').css('color', '#AAAAAA').css('font-style', 'italic');
                }
            });
            var input = 'INPUT[aria-controls="open-orders-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showOrdersDrilldownTableByDate(date, table) {
    $('#' + table).DataTable().destroy();
    $('#' + table).empty();
    var api_url = '/api/v1/order/open-orders-by-day-detail-report';
    var columns = [];

    columns.push({
        data: 'order_date',
        title: 'Order Date'
    });


    if (table == 'open-orders-facility-table') {
        columns.push({
            data: 'facility_code',
            render: function(value) {
                return '<a onclick="javascript:showOrdersDrilldownTableByFacility(\'' + value + '\')">' + value + '</a>';
            },
            title: 'Facility Code'
        });
        api_url = '/api/v1/order/open-orders-by-facility-detail-report';
    } else {
        columns.push({
            data: 'order_number',
            title: 'Order Number',
            render: function(value) {
                return '<a href="/order/view/' + value + '">' + value + '</a>';
            }
        },
        {
                data: 'business_type',
                title: 'Business Type'
        },
        {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
        });
    }

    columns.push(

        {
            data: 'cost',
            title: 'Cost'
        }, {
            data: 'subtotal',
            title: 'Subtotal'
        }, {
            data: 'discount',
            title: 'Discount'
        }, {
            data: 'tax',
            title: 'Tax'
        }, {
            data: 'shipping_cost',
            title: 'Shipping'
        }, {
            data: 'qty_ordered',
            title: 'Ordered'
        }, {
            data: 'qty_new',
            title: 'New'
        }, {
            data: 'qty_allocated',
            title: 'Allocated'
        }, {
            data: 'qty_printed',
            title: 'Printed'
        }, {
            data: 'qty_backordered',
            title: 'Backordered'
        }, {
            data: 'qty_shipped',
            title: 'Shipped'
        }, {
            data: 'qty_canceled',
            title: 'Canceled'
        }
    );

    $('#' + table).DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        initComplete: function() {
            var table = this;
            var input = '.dataTables_filter input';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
        ajax: {
            url: api_url + '?drilldown_date=' + date,
            dataSrc: "results",
            data: handleData
        },
        columns: columns,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="' + table + '"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });

    if (table == 'open-orders-facility-table') {
        $('#' + table + '_info').after(
            '<button class="btn btn-xs btn-info pull-right"' +
            'onclick="javascript:showOrdersFacilitySummaryTable()"><i class="fa fa-arrow-left"></i> View as Summary</button>'
        );
    } else {
        $('#' + table + '_info').after(
            '<button class="btn btn-xs btn-info pull-right"' +
            'onclick="javascript:showOrdersDaySummaryTable()"><i class="fa fa-arrow-left"></i> View as Summary</button>'
        );
    }
}

function showItemsSummaryTable() {
    if (typeof open_items_detail_table != 'undefined') {
        $('#open-items-table').DataTable().destroy();
        $('#open-items-table').empty();
    }

    open_items_detail_table = $('#open-items-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-by-item-detail-report',
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date',
                render: function(value) {
                    return '<a onclick="javascript:showItemsDrilldownTable(\'' + value + '\')">' + value + '</a>';
                },
            },
            {
                data: 'order_number',
                title: 'Order Number',
                render: function(value) {
                    return '<a href="/order/view/' + value + '">' + value + '</a>'
                }
            },
            {
                data: 'company',
                title: 'Company'
            },
            {
                data: 'po_number',
                title: 'PO Number'
            },
            {
                data: 'business_type',
                title: 'Business Type'
            },
            {
                data: 'item_code',
                title: 'Item Code',
                render: function(value) {
                    return '<a href="/product/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'color_description',
                title: 'Color Description'
            },
            {
                data: 'size_description',
                title: 'Size Description'
            },
            {
                data: 'sku_code',
                title: 'Sku Code'
            },
            {
                data: 'backorderable',
                title: 'Backorderable',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            },
            {
                data: 'available_quantity',
                title: 'Available'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            }

        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-items-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showItemsDrilldownTable(date) {
    $('#open-items-table').DataTable().destroy();
    $('#open-items-table').empty();

    $('#open-items-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-by-item-detail-report?drilldown_date=' + date,
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date'
            },
            {
                data: 'order_number',
                title: 'Order Number',
                render: function(value) {
                    return '<a href="/order/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'business_type',
                title: 'Business Type'
            },
            {
                data: 'item_code',
                title: 'Item Code',
                render: function(value) {
                    return '<a href="/product/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'color_description',
                title: 'Color Description'
            },
            {
                data: 'size_description',
                title: 'Size Description'
            },
            {
                data: 'sku_code',
                title: 'Sku Code'
            },
            {
                data: 'backorderable',
                title: 'Backorderable'
            },
            {
                data: 'available_quantity',
                title: 'Available'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'qty_canceled'
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-backorders-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });

    $('#open-items-table_info').after(
        '<button class="btn btn-xs btn-info pull-right"' +
        'onclick="javascript:showItemsSummaryTable()"><i class="fa fa-arrow-left"></i> View as Summary</button>'
    );
}

function showBackOrdersSummaryTable() {
    if (typeof open_backorders_detail_table != 'undefined') {
        $('#open-backorders-table').DataTable().destroy();
        $('#open-backorders-table').empty();
    }

    open_backorders_detail_table = $('#open-backorders-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-by-backorder-detail-report',
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date',
                render: function(value) {
                    var date = new Date(value);
                    return date.toISOString().substring(0, 10)
                }
            },
            {
                data: 'cancel_date',
                title: 'Cancel Date',
                render: function(value) {
                    if(!value) {
                        return '';
                    }
                    var date = new Date(value);
                    return date.toISOString().substring(0, 10)
                }
            },
            {
                data: 'order_number',
                title: 'Order Number',
                render: function(value) {
                    return '<a href="/order/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'customer_name',
                title: 'Customer Name'
            },
            {
                data: 'company',
                title: 'Company'
            },
            {
                data: 'customer_email',
                title: 'Customer Email'
            },
            {
                data: 'business_type',
                title: 'Business Type'
            },
            {
                data: 'item_code',
                title: 'Item Code'
            },
            {
                data: 'color_description',
                title: 'Color Description'
            },
            {
                data: 'size_description',
                title: 'Size Description'
            },
            {
                data: 'sku_code',
                title: 'Sku Code'
            },
            {
                data: 'retail_price',
                title: 'Retail Price'
            },
            {
                data: 'available_quantity',
                title: 'Available',
            },
            {
                data: 'qty_ordered',
                title: 'Ordered',
            },
            {
                data: 'qty_new',
                title: 'New',
            },
            {
                data: 'qty_allocated',
                title: 'Allocated',
            },
            {
                data: 'qty_printed',
                title: 'Printed',
            },
            {
                data: 'backorderable',
                title: 'Backorderable',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            },
            {
                data: 'qty_backordered',
                title: 'Backordered',
            },
            {
                data: 'qty_shipped',
                title: 'Shipped',
            },
            {
                data: 'qty_canceled',
                title: 'Canceled',
            },
            {
                data: 'qty_onhand',
                title: 'On Hand',
            },
            {
                data: 'qty_ondock',
                title: 'On Dock',
            },
            {
                data: 'qty_onorder',
                title: 'On Order',
            },
            {
                data: 'next_receipt',
                title: 'Next Receipt',
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-backorders-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showRushOrdersTable() {
    if (typeof open_orders_rush_detail_table != 'undefined') {
        $('#open-orders-rush-table').DataTable().destroy();
        $('#open-orders-rush-table').empty();
    }

    open_orders_rush_detail_table = $('#open-orders-rush-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: '/api/v1/order/open-orders-detail-report?rush=1',
            dataSrc: "results",
            data: handleData
        },
        columns: [{
                data: 'order_date',
                title: 'Order Date'
            },
            {
                data: 'order_number',
                title: 'Order Number',
                render: function(value) {
                    return '<a href="/order/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'business_type',
                title: 'Business Type'
            },
            {
                data: 'facility_code',
                title: 'Facility Code'
            },
            {
                data: 'cost',
                title: 'Cost'
            },
            {
                data: 'subtotal',
                title: 'Subtotal'
            },
            {
                data: 'discount',
                title: 'Discount'
            },
            {
                data: 'tax',
                title: 'Tax'
            },
            {
                data: 'shipping_cost',
                title: 'Shipping'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-orders-rush-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function showOpenOrdersByCompanyDrillDown(order_numbers, filter_data){
    $('.nav-tabs li:eq(2) a').tab('show');
    // order_numbers = encodeURIComponent(order_numbers)
    order_numbers = JSON.stringify(order_numbers)
    filter_data = JSON.stringify(filter_data)
    loadSummary('order', order_numbers)
    showOrdersSummaryTable(filter_data, null)
}

function showOpenOrdersByCompanyItemAggDrillDown(filter_data){
    $('.nav-tabs li:eq(5) a').tab('show');
    filter_data = JSON.stringify(filter_data)
    loadSummary('item_agg', null, filter_data)
    showOpenOrderByItemAggTable(filter_data)
}

function showScheduleModal(order_numbers, company, row_index) {
    $('#edit-routing-schedule-modal').appendTo("body").modal();
    $("#modal-edit-wait-for-values").show();
    $("#modal-edit-values-loaded").hide();
    $('#modal-routing-schedule-submit').off('click');
    $('#modal-routing-schedule-submit').hide();
    $('select[name="routing_required"]').val('')
    $('select[name="kitting_required"]').val('')
    $('input[name="route_date"]').val('')
    $('input[name="pack_date"]').val('')
    $('input[name="ship_date"]').val('')
    $('input[name="updated_cancel_date"]').val('')
    $('select[name="ship_as"]').val('');
    $('select[name="routed"]').val('');
    $('select[name="confirmed"]').val('');
    $('textarea[name="scheduling_comments"]').val('');
    $("#modal-routing-schedule-submit").data('company', company);
    $("#modal-routing-schedule-submit").data('row-index', row_index);
    $.ajax({
        url: '/api/v1/order/schedule-routing?order_numbers=' + encodeURIComponent(JSON.stringify(order_numbers)),
        method: 'GET',
        success: function(response) {
            result = response.results[0]
            if (result['routing_required'] !== null) {
                $('select[name="routing_required"]').val(result['routing_required'].toString())
            }
            if (result['kitting_required'] !== null) {
                $('select[name="kitting_required"]').val(result['kitting_required'].toString())
            }
            if (result['route_date'] !== null) {
                $('input[name="route_date"]').val(result['route_date'].slice(0,10))
            }
            if (result['pack_date'] !== null) {
                $('input[name="pack_date"]').val(result['pack_date'].slice(0,10))
            }
            if (result['ship_date'] !== null) {
                $('input[name="ship_date"]').val(result['ship_date'].slice(0,10))
            }
            if (result['updated_cancel_date'] !== null) {
                $('input[name="updated_cancel_date"]').val(result['updated_cancel_date'].slice(0,10))
            }
            if (result['routed'] !== null) {
                $('select[name="routed"]').val(result['routed'].toString())
            }
            if (result['confirmed'] !== null) {
                $('select[name="confirmed"]').val(result['confirmed'].toString())
            }
            if (result['scheduling_comments'] !== null) {
                $('textarea[name="scheduling_comments"]').val(result['scheduling_comments'])
            }
            if (result['ship_as'] !== null){
                $('select[name="ship_as"]').val(result['ship_as'].toString())
            }
            project_id = result.project_id;
            project_number = result.project_number

            $.ajax({
                url: '/api/v1/project/project?status=OPEN&limit=1000&use_parent=1',
                method: 'GET',
                success: function(response) {
                    results = response.results;
                    var project_selector = $('select[name="project"]')
                    project_selector.empty();
                    project_selector.append($('<option></option>').attr("value", "").text(""))
                    $.each(results, function(index, value){
                        var text = value.project_number + '. ' + value.short_description;
                        project_selector.append($('<option></option>').attr("value", value.id).text(text))
                    })
                    project_selector.val(project_id)
                }
            });
            $("#modal-edit-wait-for-values").hide();
            $("#modal-edit-values-loaded").show();
            $('#modal-routing-schedule-submit').show();
        }
    });

    $('#modal-routing-schedule-submit').click(function(){
        $(this).html('<span class="fa fa-spin fa-spinner"></span> Just a moment...').prop('disabled', true);
        var row_index = $(this).data('row-index'),
            data = {
                'routing_required': $('select[name="routing_required"]').val(),
                'kitting_required': $('select[name="kitting_required"]').val(),
                'routed': $('select[name="routed"]').val(),
                'confirmed': $('select[name="confirmed"]').val(),
                'route_date': $('input[name="route_date"]').val(),
                'pack_date': $('input[name="pack_date"]').val(),
                'ship_date': $('input[name="ship_date"]').val(),
                'updated_cancel_date': $('input[name="updated_cancel_date"]').val(),
                'project_id': $('select[name="project"]').val(),
                'project_name': $('select[name="project"] option:selected').text(),
                'scheduling_comments': $('textarea[name="scheduling_comments"]').val(),
                'ship_as': $('select[name="ship_as"]').val(),
                'company': $(this).data('company'),
                'order_numbers': order_numbers
            };

        $.ajax({
            url: '/api/v1/order/schedule-routing',
            contentType: "application/json",
            method: 'POST',
            dataType: 'json',
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            data: JSON.stringify(data),
            success: function(response){
                var nodes = $('#open-orders-company-table').DataTable().row(row_index).nodes().to$();
                var points = ['route_date', 'pack_date', 'ship_date', 'updated_cancel_date', 'project_name', 'ship_as'];
                for (let point of points) {
                    nodes.find("."+point).html(data[point]);
                }
                nodes.find(".scheduling_comments").html(
                    (data.scheduling_comments && data.scheduling_comments.length > 20) ?
                    data.scheduling_comments.substr(0, 20) + '...<span class="show-comments fa fa-plus-square" style="cursor: pointer;"></span>'
                        + '<div class="scheduling-comments-box" style="display: none; padding: 15px; border: 1px solid #666; position: absolute; top: 0; z-index: 2000; background-color: #FFF; width: 400px;">'
                        + '<div style="padding-left: 15px;" class="pull-right"><div class="btn btn-sm btn-default close-scheduling-comments"><span class="fa fa-times"></span></div></div>'
                        + '<div style="white-space: pre-line;">' + data.scheduling_comments + '</div></div>' :
                    (data.scheduling_comments == null) ? '' : data.scheduling_comments
                );
                nodes.find('.trigger-extra-info-modal').data('comments', data.scheduling_comments).data('ship-as', data.ship_as);
                var points2 = ['routing_required', 'kitting_required', 'routed', 'confirmed'];
                for (let point of points2) {
                    nodes.find("."+point).html(
                        (data[point] == null) ? '' :
                        (data[point] == 'true') ? 'Yes' : 'No'
                    );
                } 
                $('#open-orders-company-table').DataTable().columns.adjust();
                toastr_success_wrapper(response.msg, 'Saved Successfully!');
                $('#modal-routing-schedule-submit').html('Submit').prop('disabled', false);
                $('#edit-routing-schedule-modal').modal('hide');
            },
            error: function() {
                toastr.error("Unabled to post changes to the schedule.");
                $('#modal-routing-schedule-submit').html('Submit').prop('disabled', false);
            }
        })
    });
}

function showOpenOrdersByCompanyTable() {
    $('input[name="route_date"], input[name="pack_date"], input[name="ship_date"], input[name="updated_cancel_date"]').datepicker({
        format: 'yyyy-mm-dd',
        keyboardNavigation: false,
        forceParse: true,
        autoclose: true
    });
    if (typeof open_orders_company_detail_table != 'undefined') {
        $('#open-orders-company-table').DataTable().destroy();
        $('#open-orders-company-table').empty();
    }

    open_orders_company_detail_table = $('#open-orders-company-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        ajax: {
            url: '/api/v1/order/open-orders-by-company-detail-report',
            dataSrc: "results",
            data: function(d) {
                d.format = 'datatables';

                if (typeof d.search !== 'undefined') {
                    d.search = d.search.value;
                }

                // Date range input for reports
                if ($('input[name="start_date_report"]') && $('input[name="start_date_report"]').val() &&
                    $('input[name="end_date_report"]')) {
                    d.start_date = Date.parse($('input[name="start_date_report"]').val()).toString('yyyy-MM-dd');
                    d.end_date = Date.parse($('input[name="end_date_report"]').val()).toString('yyyy-MM-dd');
                }

                d.search_fields = [];
                d.column_fields = [];

                var columns = d.columns;
                for (var i = 0; i < columns.length; i++) {
                    var search_field = (typeof columns[i].search_field == 'undefined') ?
                        columns[i].data :
                        columns[i].search_field;
                    d.search_fields.push(search_field);
                    d.column_fields.push(columns[i].data);
                }

                //pass what API is expecting for limit/offset
                d.limit = d.length;
                d.offset = d.start;

                // remove data the server doesnt need - this reduces the number of query params
                // and helps keep the url shorter
                for(i=0; i<columns.length; i++) {
                    delete columns[i].searchable;
                    delete columns[i].search.regex;
                    delete columns[i].orderable;
                }
            },
        },
        order: [[1, 'desc']],
        columns: [
            {
                title: '',
                data: 'order_numbers',
                orderable: false,
                render: function(data, x, row, meta){
                  return '<button class="btn btn-primary btn-sm" name="schedule" data-row-index="'+meta.row+'" data-company="'+row.company+'">Schedule</button>';
                }
            },
            {
                data: 'order_date',
                title: 'Order Date'
            },
            {
                data: 'customer_number',
                title: 'Customer Number',
                render: function(data) {
                    return (data.indexOf(',') > -1) ? 'Various' : data;
                }
            },
            {
                data: 'company',
                title: 'Company',
                render: function(data, x, row) {
                    return '<a href="#" data-pick-ticket-count="'+row.pick_ticket_count+'" data-pick-ticket-units="' + row.pick_ticket_units + '" data-pick-ticket-skus="' + row.pick_ticket_skus +'" '
                           + 'data-ship-as="'+(row.ship_as ? row.ship_as : '')+'" data-avg-pick-ticket-skus="' + row.avg_pick_ticket_skus +'" data-max-pick-ticket-skus="' + row.max_pick_ticket_skus +'" '
                           + 'data-comments="' + (row.comments ? row.comments : '') +'" data-company="' + data + '" class="trigger-extra-info-modal">' + data + '</a>';
                }
            },
            {
                data: 'comments',
                className: 'scheduling_comments',
                title: 'Comments',
                render: function(data) {
                    if(!data) {
                        return '';
                    }
                    if(data.length > 20) {
                        return data.substr(0, 20) + '...<span class="show-comments fa fa-plus-square" style="cursor: pointer;"></span>'
                            + '<div class="scheduling-comments-box" style="display: none; padding: 15px; border: 1px solid #666; position: absolute; top: 0; z-index: 2000; background-color: #FFF; width: 400px;">'
                            + '<div style="padding-left: 15px;" class="pull-right"><div class="btn btn-sm btn-default close-scheduling-comments"><span class="fa fa-times"></span></div></div>'
                            + '<div style="white-space: pre-line;">' + data + '</div></div>';
                    }
                    return data;
                }
            },
            {
                data: 'source_code',
                title: 'Source Code'
            },
            {
                data: 'start_date',
                title: 'Start Date'
            },
            {
                data: 'cancel_date',
                title: 'Cancel Date'
            },
            {
                data: 'updated_cancel_date',
                className: 'updated_cancel_date',
                title: 'Updated Cancel Date'
            },
            {
                data: 'routing_required',
                className: 'routing_required',
                title: 'Routing Required',
                render: function(data) {
                    if (data === null) {
                        return ''
                    }
                    return data == true ? 'Yes' : 'No'
                }
            },
            {
                data: 'kitting_required',
                className: 'kitting_required',
                title: 'Kitting Required',
                render: function(data) {
                    if (data === null) {
                        return ''
                    }
                    return data == true ? 'Yes' : 'No'
                }
            },
            {
                data: 'ship_as',
                className: 'ship_as',
                title: 'Ship As'
            },
            {
                data: 'route_date',
                className: 'route_date',
                title: 'Route Date'
            },
            {
                data: 'routed',
                className: 'routed',
                title: 'Routed',
                render: function(data) {
                    if (data === null) {
                        return ''
                    }
                    return data == true ? 'Yes' : 'No'
                }
            },
            {
                data: 'pack_date',
                className: 'pack_date',
                title: 'Pack Date'
            },
            {
                data: 'ship_date',
                className: 'ship_date',
                title: 'Ship Date'
            },
            {
                data: 'confirmed',
                className: 'confirmed',
                title: 'Confirmed',
                render: function(data) {
                    if (data === null) {
                        return ''
                    }
                    return data == true ? 'Yes' : 'No'
                }
            },
            {
                data: 'project_number',
                className: 'project_number',
                title: 'Project',
                render: function(data, type, row, meta) {
                    if (data) {
                        return '<a href="#" title="Short Description" data-toggle="popover" data-trigger="hover" data-content="' + row.short_description + '">' + data + '</a>'
                    } else {
                        return ''
                    }
                }
            },
            {
                data: 'num_orders',
                title: 'Orders',
                render: function(data, type, row, meta){
                    return '<a href="#" name="order_numbers">' + data + '</a>';
                }
            },
            {
                data: 'merchandise_amount',
                title: 'Merchandise Amount'
            },
            {
                data: 'discount',
                title: 'Discount'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered',
                render: function(data, type, row, meta){
                    return '<a href="#" name="units_ordered">' + data + '</a>';
                }
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_allocated',
                title: 'Allocated'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            },
            {
                data: 'hold',
                title: 'Hold',
                render: function(data) {
                    if (data == true) return 'Yes'
                    if (data == false) return 'No'
                }
            },
            { data: null, orderable: false, searchable: false, defaultContent: '' },
            {
                data: 'open',
                title: 'Open'
            },
            {
                data: 'waved',
                title: 'Waved'
            },
            {
                data: 'batched',
                title: 'Batched'
            },
            {
                data: 'in_picking',
                title: 'In Picking'
            },
            {
                data: 'in_exception',
                title: 'In Exception'
            },
            {
                data: 'triage',
                title: 'Triage'
            },
            {
                data: 'pick_complete',
                title: 'Pick Complete'
            },
            {
                data: 'kitting',
                title: 'Kitting'
            },
            {
                data: 'inducted',
                title: 'Inducted'
            },
            {
                data: 'in_packing',
                title: 'In Packing'
            },
            {
                data: 'pack_complete',
                title: 'Pack Complete'
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-orders-company-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
        drawCallback: function(settings) {
            download_utility.bind();
            $('[data-toggle="popover"]').popover({container: 'body'});
            $('#open-orders-company-table').DataTable().rows().every(function( rowIdx, tableLoop, rowLoop){
                var filter_data = {}
                var order_numbers = this.data().order_numbers
                filter_data['order_date'] = this.data().order_date
                filter_data['customer_number'] = this.data().customer_number
                filter_data['company'] = this.data().company
                filter_data['source_code'] = this.data().source_code
                filter_data['start_date'] = this.data().start_date
                filter_data['cancel_date'] = this.data().cancel_date
                filter_data['hold'] = this.data().hold
                this.nodes().to$().find('a[name="order_numbers"]').click(function(){
                    showOpenOrdersByCompanyDrillDown(order_numbers, filter_data);
                })
                this.nodes().to$().find('button[name="schedule"]').click(function(){
                    showScheduleModal(order_numbers, $(this).data('company'), $(this).data('row-index'))
                })
                this.nodes().to$().find('a[name="units_ordered"]').click(function(){
                    showOpenOrdersByCompanyItemAggDrillDown(filter_data)
                })
            })
        }
    });
}

$(document).on('click', '.show-comments', function() {
    var position = $(this).parents("TD").offset();
    $(this).parent().find('.scheduling-comments-box').show().offset({ top: (position.top + 10), left: (position.left + 10)});
});

$(document).on('click', '.close-scheduling-comments', function() {
    $(this).parents('.scheduling-comments-box').hide();
});

$(document).on('click', '.trigger-extra-info-modal', function() {
    var company = $(this).data('company'), pick_ticket_count = parseInt($(this).data('pick-ticket-count')), pick_ticket_units = $(this).data('pick-ticket-units'),
        pick_ticket_skus = parseInt($(this).data('pick-ticket-skus')), ship_as = $(this).data('ship-as'), max_pick_ticket_skus = $(this).data('max-pick-ticket-skus'),
        avg_pick_ticket_skus = $(this).data('avg-pick-ticket-skus'), scheduling_comments = $(this).data('comments');
    avg_pick_ticket_skus = avg_pick_ticket_skus > 0 ? Math.round(avg_pick_ticket_skus * 10) / 10 : '&mdash;';
    $("#extra-info-modal").find(".modal-title").html(company);
    $("#pick-ticket-count").html(pick_ticket_count);
    $("#pick-ticket-units").html(pick_ticket_units);
    $("#pick-ticket-skus").html(pick_ticket_skus);
    $("#max-pick-ticket-skus").html(max_pick_ticket_skus);
    $("#avg-pick-ticket-skus").html(avg_pick_ticket_skus);
    $("#ship-as-type").html(ship_as);
    $("#scheduling-comments-info").html(scheduling_comments);
    $("#extra-info-modal").modal('show');
})

function showOpenOrderByItemAggTable(filter_data = null) {
    if (typeof open_items_agg_table != 'undefined') {
        $('#open-items-agg-table').DataTable().destroy();
        $('#open-items-agg-table').empty();
    }
    var url = '/api/v1/order/open-orders-by-item-agg-report'
    if (filter_data !== null) {
        url = url + '?filter_data=' + encodeURIComponent(filter_data)
    }
    open_items_agg_table = $('#open-items-agg-table').DataTable({
        responsive: false,
        processing: true,
        serverSide: true,
        drawCallback: function( settings ) {
            download_utility.bind()
        },
        ajax: {
            url: url,
            dataSrc: "results",
            data: handleData
        },
        columns: [
            {
                data: 'item_code',
                title: 'Item Code',
                render: function(value) {
                    return '<a href="/product/view/' + value + '">' + value + '</a>';
                }
            },
            {
                data: 'color_description',
                title: 'Color Description'
            },
            {
                data: 'size_description',
                title: 'Size Description'
            },
            {
                data: 'sku_code',
                title: 'Sku Code'
            },
            {
                data: 'barcode',
                title: 'Barcode'
            },
            {
                data: 'available_quantity',
                title: 'Available'
            },
            {
                data: 'qty_ordered',
                title: 'Ordered'
            },
            {
                data: 'qty_new',
                title: 'New'
            },
            {
                data: 'qty_printed',
                title: 'Printed'
            },
            {
                data: 'qty_backordered',
                title: 'Backordered'
            },
            {
                data: 'qty_shipped',
                title: 'Shipped'
            },
            {
                data: 'qty_canceled',
                title: 'Canceled'
            },
            { data: null, orderable: false, searchable: false, defaultContent: '' },
            {
                data: 'open',
                title: 'Open'
            },
            {
                data: 'waved',
                title: 'Waved'
            },
            {
                data: 'batched',
                title: 'Batched'
            },
            {
                data: 'in_picking',
                title: 'In Picking'
            },
            {
                data: 'in_exception',
                title: 'In Exception'
            },
            {
                data: 'triage',
                title: 'Triage'
            },
            {
                data: 'pick_complete',
                title: 'Pick Complete'
            },
            {
                data: 'inducted',
                title: 'Inducted'
            },
            {
                data: 'in_packing',
                title: 'In Packing'
            },
            {
                data: 'pack_complete',
                title: 'Pack Complete'
            }
        ],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: getButtons(),
        "scrollX": true,
        initComplete: function(e) {
            var table = this;
            var input = 'INPUT[aria-controls="open-items-agg-table"]';
            $(input).unbind();
            $(input).on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    table.fnFilter($(this).val());
                }
            });
        },
    });
}

function setupTables() {
    $('a[href="#open-orders-day"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-day-table' )) {
            loadSummary('day')
            showOrdersDaySummaryTable();
        }
    });

    $('a[href="#open-orders-facility"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-facility-table' )) {
            loadSummary('facility')
            showOrdersFacilitySummaryTable();
        }
    });

    $('a[href="#open-orders"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-table' )) {
            loadSummary('order')
            showOrdersSummaryTable();
        }
    });

    $('a[href="#open-items"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-items-table' )) {
            loadSummary('item')
            showItemsSummaryTable();
        }
    });

    $('a[href="#open-backorders"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-backorders-table' )) {
            showBackOrdersSummaryTable();
            loadSummary('backorder')
        }
    });

    $('a[href="#open-rush"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-rush-table' )) {
            showRushOrdersTable();
            loadSummary('rush')
        }
    });

    $('a[href="#open-company"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-company-table' )) {
            showOpenOrdersByCompanyTable();
            loadSummary('company')
        }
    });

    $('a[href="#open-items-agg"]').on('click', function() {
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-item-agg-table' )) {
            showOpenOrderByItemAggTable();
            loadSummary('item_agg')
        }
    });
}

$(function() {
    calendar_comments = [];
    showCalendar()
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        $('#b2b-calendar').fullCalendar('changeView', 'basicWeek')
    })


    $('#orders').html('0').digits();
    $('#total').html('0').currency();
    $('#date-range-filter .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: true,
        autoclose: true
    });

    $('#date-range-btn').click(function() {
        if ($("ul.nav-tabs li.active").text() == 'Day'){
            loadSummary('day');
            $('#open-orders-day-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Day/Facility'){
            loadSummary('facility');
            $('#open-orders-facility-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Orders') {
            loadSummary('order');
            $('#open-orders-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Items') {
            $('#open-items-agg-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Items By Order') {
            loadSummary('item');
            $('#open-items-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Backorders') {
            loadSummary('backorder');
            $('#open-backorders-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Rush') {
            loadSummary('rush');
            $('#open-orders-rush-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Company') {
            loadSummary('company');
            $('#open-orders-company-table').DataTable().ajax.reload();
        }
    });

    setupTables();

    /*
    //re-draw tables when shown
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $('#open-orders-day-table').DataTable().draw();
        $('#open-orders-facility-table').DataTable().draw();
        $('#open-orders-table').DataTable().draw();
        $('#open-items-table').DataTable().draw();
        $('#open-backorders-table').DataTable().draw();
    });
    */

    //deal with date range
    $('#date-range-filter .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: true,
        autoclose: true
    });

    // link to tab
    /* Not used anymore. Keep it for future reference
    var url = document.location.toString();
    if (url.match('#')) {
        tab = url.split('#')[1];
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        if ( ! $.fn.DataTable.isDataTable( '#open-orders-table' )) {
            calendar_data = {
                'date': date,
                'type': type
            }
            calendar_data_string = JSON.stringify(calendar_data)
            showOrdersSummaryTable(null, calendar_data_string);
            loadSummary('order', null, null, calendar_data)
        }
        // Change hash for page-reload
        $('.nav-tabs a').on('shown.bs.tab', function (e) {
            window.location.hash = e.target.hash;
        })
    }
    else {
        loadSummary('day');
        showOrdersDaySummaryTable();
    }
    */

   loadSummary('day');
   showOrdersDaySummaryTable();

    $('#date-range-custom-btn').click(function() {
        if ($("ul.nav-tabs li.active").text() == 'Day'){
            loadSummary('day');
            $('#open-orders-day-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Day/Facility'){
            loadSummary('facility');
            $('#open-orders-facility-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Orders') {
            loadSummary('order');
            $('#open-orders-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Items') {
            $('#open-items-agg-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Items By Order') {
            loadSummary('item');
            $('#open-items-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Backorders') {
            loadSummary('backorder');
            $('#open-backorders-table').DataTable().ajax.reload();
        }
        if ($("ul.nav-tabs li.active").text() == 'Rush') {
            loadSummary('rush');
            $('#open-orders-rush-table').DataTable().ajax.reload();
        }
    });
});